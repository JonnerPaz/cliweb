import db from "../db.js";

// Nombre de archivo seguro a partir del nombre de la liga.
function safeFilename(name) {
  return (name || "liga").replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
}

/**
 * Exporta una liga completa (liga, equipos, jugadores, partidos y eventos)
 * a un archivo JSON descargable. La estructura exportada es la misma que
 * espera `importLeague` para restaurarla.
 *
 * @param {number} leagueId
 */
export async function exportLeague(leagueId) {
  const league = await db.getById("leagues", leagueId);
  if (!league) throw new Error("La liga no existe.");

  const [teams, matches] = await Promise.all([
    db.getByIndex("teams", "leagueId", leagueId),
    db.getByIndex("matches", "leagueId", leagueId),
  ]);

  const players = [];
  for (const t of teams) {
    players.push(...(await db.getByIndex("players", "teamId", t.id)));
  }

  const events = [];
  for (const m of matches) {
    events.push(...(await db.getByIndex("events", "matchId", m.id)));
  }

  const payload = {
    app: "leaguehub",
    version: 1,
    exportedAt: new Date().toISOString(),
    league,
    teams,
    players,
    matches,
    events,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `liga-${safeFilename(league.name)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
