import db from "../db.js";

// Envuelve un request de IndexedDB en una promesa manteniendo la transacción viva.
function q(store, method, ...args) {
  return new Promise((resolve, reject) => {
    const req = store[method](...args);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Consulta un store por índice dentro de una transacción abierta.
function qIndex(store, indexName, value) {
  return new Promise((resolve, reject) => {
    const req = store.index(indexName).getAll(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// En el bracket, el partido (ronda r, posición p) alimenta al partido
// (ronda r+1, posición ⌊p/2⌋): slot local si p es par, visitante si es impar.
async function findNextMatch(store, match) {
  if (match.round == null || match.position == null) return null;
  const nextRound = match.round + 1;
  const nextPosition = Math.floor(match.position / 2);
  const matches = await qIndex(store, "leagueId", match.leagueId);
  return matches.find((m) => m.round === nextRound && m.position === nextPosition) || null;
}

/**
 * Operación de integridad: finaliza un partido en una sola transacción de
 * IndexedDB. Calcula el marcador a partir de los eventos registrados,
 * actualiza el partido y, en modalidad eliminación directa, avanza al
 * ganador al slot correspondiente del partido de la siguiente ronda.
 *
 * @param {number} matchId
 * @param {{ declaredWinnerId?: number }} [opts]
 *   `declaredWinnerId` es obligatorio cuando el marcador empata en torneo.
 * @returns {Promise<object>} El partido finalizado.
 */
export async function finalizeMatch(matchId, { declaredWinnerId } = {}) {
  let finalized;

  await db.runTransaction(["leagues", "matches", "events", "players"], "readwrite", async (stores) => {
    const match = await q(stores.matches, "get", matchId);
    if (!match) throw new Error("El partido no existe.");
    if (match.status === "Finalizado") throw new Error("El partido ya está finalizado.");

    const league = await q(stores.leagues, "get", match.leagueId);
    const isTournament = league?.modalidad === "tournament";

    const events = await qIndex(stores.events, "matchId", matchId);

    // El marcador se computa contando los eventos de cada equipo.
    let homeScore = 0;
    let awayScore = 0;
    for (const ev of events) {
      const player = await q(stores.players, "get", ev.playerId);
      if (player?.teamId === match.homeTeamId) homeScore += 1;
      else if (player?.teamId === match.awayTeamId) awayScore += 1;
    }

    const updated = { ...match, status: "Finalizado", homeScore, awayScore };

    if (isTournament) {
      if (homeScore === awayScore) {
        if (!declaredWinnerId || (declaredWinnerId !== match.homeTeamId && declaredWinnerId !== match.awayTeamId)) {
          throw new Error("En eliminación directa un empate requiere declarar un ganador.");
        }
        updated.winnerId = declaredWinnerId;
      } else {
        updated.winnerId = homeScore > awayScore ? match.homeTeamId : match.awayTeamId;
      }

      await q(stores.matches, "put", updated);

      // Avance automático del ganador al siguiente partido, en la misma transacción.
      const nextMatch = await findNextMatch(stores.matches, match);
      if (nextMatch) {
        const slot = match.position % 2 === 0 ? "homeTeamId" : "awayTeamId";
        await q(stores.matches, "put", { ...nextMatch, [slot]: updated.winnerId });
      }
    } else {
      delete updated.winnerId;
      await q(stores.matches, "put", updated);
    }

    finalized = updated;
  });

  return finalized;
}
