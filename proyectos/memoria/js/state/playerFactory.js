import { User } from "../state/User.js";

export function createPlayers(gameMode, playerNames) {
  const p1 = new User(playerNames.player1?.trim() || "Entrenador 1", 0, 0, 0);
  if (gameMode === "pvp") {
    return [
      p1,
      new User(playerNames.player2?.trim() || "Entrenador 2", 0, 0, 0),
    ];
  }
  return [p1];
}
