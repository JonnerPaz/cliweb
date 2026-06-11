import awardChecker from "../core/awards.js";

export function buildResults({
  gameMode,
  difficulty,
  players,
  timerSeconds,
  pairsCount,
  totalMovements,
  firstMatchTurn,
}) {
  const results = {
    gameMode,
    difficulty,
    players: players.map((p) => ({
      playerName: p.name,
      points: p.points,
      movements: p.movements,
    })),
    time: timerSeconds ?? 0,
    totalPairs: pairsCount,
    totalMovements,
    firstMoveMatch: firstMatchTurn,
  };

  if (gameMode === "pvp" && players.length === 2) {
    results.winner =
      players[0].points > players[1].points
        ? players[0].name
        : players[1].points > players[0].points
          ? players[1].name
          : null;
  }

  const newAwards = awardChecker.checkAwards(results);
  results.awards = awardChecker.getUnlockedAwards();

  return { results, newAwards };
}
