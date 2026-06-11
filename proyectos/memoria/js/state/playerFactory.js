import { User } from "../state/User.js";

export function createPlayers(gameMode, currentPlayers) {
  const name1 = currentPlayers?.player1?.name?.trim() || "Entrenador 1";
  const p1 = new User(name1, 0, 0, 0);
  if (gameMode === "pvp") {
    const name2 = currentPlayers?.player2?.name?.trim() || "Entrenador 2";
    return { player1: p1, player2: new User(name2, 0, 0, 0) };
  }
  return { player1: p1, player2: null };
}
