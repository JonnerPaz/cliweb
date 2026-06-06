export function createPlayerBadge(user) {
    const badge = document.createElement('article');
    badge.className = 'player-badge';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'player-name';

    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats';

    const pointsSpan = document.createElement('span');
    pointsSpan.className = 'points';

    const movementsSpan = document.createElement('span');
    movementsSpan.className = 'movements';

    const awardsSpan = document.createElement('span');
    awardsSpan.className = 'awards';

    statsDiv.append(pointsSpan, movementsSpan, awardsSpan);
    infoDiv.append(nameSpan, statsDiv);
    badge.appendChild(infoDiv);

    const updateView = () => {
        nameSpan.textContent = user.name;
        pointsSpan.textContent = `Puntos: ${user.points}`;
        movementsSpan.textContent = `Movimientos: ${user.movements}`;
        awardsSpan.textContent = `Logros: ${user.awards}`;
    };

    updateView();

    badge.refresh = updateView;

    return badge;
}