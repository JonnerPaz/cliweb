export function createPlayerBadge(user) {
  const badge = document.createElement("article");
  badge.className = "player-badge";

  // Creacion de elementos
  const nameSpan = document.createElement("span");
  nameSpan.className = "player-name";

  const pointsSpan = document.createElement("span");
  pointsSpan.className = "points";

  const movementsSpan = document.createElement("span");
  movementsSpan.className = "movements";

  const awardsSpan = document.createElement("span");
  awardsSpan.className = "awards";

  // Construcción
  const statsDiv = document.createElement("div");
  statsDiv.className = "stats";
  statsDiv.append(pointsSpan, movementsSpan, awardsSpan);

  const infoDiv = document.createElement("div");
  infoDiv.className = "info";
  infoDiv.append(nameSpan, statsDiv);
  badge.appendChild(infoDiv);

  const updatePlayerStats = (points, movements) => {
    nameSpan.textContent = user.name;
    pointsSpan.textContent = `Puntos: ${points}`;
    movementsSpan.textContent = `Movimientos: ${movements}`;
    awardsSpan.textContent = `Logros: ${user.awards}`;
  };

  updatePlayerStats(user.points, user.movements);

  return {
    element: badge,
    updatePlayerStats,
  };
}
