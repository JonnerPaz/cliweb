export const createPlayerBadge = (playerData) => {
    const badge = document.createElement('article');
    badge.className = 'playerBadge';

    const playerName = document.createElement('h3');
    playerName.textContent = playerData.name;
    badge.appendChild(playerName);

    const stats = document.createElement('div');
    stats.className = 'stats';

    const points = document.createElement('p');
    points.className = 'points';
    badge.pointsElement = points; 
    points.textContent = `Points: ${playerData.points}`;
    stats.appendChild(points);

    const movements = document.createElement('p');
    movements.className = 'movements';
    badge.movementsElement = movements;
    movements.textContent = `Movements: ${playerData.movements}`;
    stats.appendChild(movements);

    const awards = document.createElement('p');
    awards.className = 'awards';
    badge.awardsElement = awards;
    awards.textContent = `Awards: ${playerData.awards}`;
    stats.appendChild(awards);

    badge.appendChild(stats);

    return badge;
};

