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
  const playerList = Object.values(players).filter(Boolean);
  const results = {
    gameMode,
    difficulty,
    players: playerList.map((p) => ({
      playerName: p.name,
      points: p.points,
      movements: p.movements,
    })),
    time: timerSeconds ?? 0,
    totalPairs: pairsCount,
    totalMovements,
    firstMoveMatch: firstMatchTurn,
  };

  if (gameMode === "pvp" && playerList.length === 2) {
    results.winner =
      playerList[0].points > playerList[1].points
        ? playerList[0].name
        : playerList[1].points > playerList[0].points
          ? playerList[1].name
          : null;
  }

  const newAwards = awardChecker.checkAwards(results);
  results.awards = awardChecker.getUnlockedAwards();

  return { results, newAwards };
}
