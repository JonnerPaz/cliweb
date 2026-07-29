export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateRoundRobin(teams, totalRounds = 1) {
  if (teams.length < 2) return [];

  const ids = teams.map((t) => t.id);
  if (ids.length % 2 !== 0) ids.push(null);

  const n = ids.length;
  const roundsPerLeg = n - 1;
  const matches = [];

  for (let leg = 0; leg < totalRounds; leg++) {
    for (let r = 0; r < roundsPerLeg; r++) {
      for (let i = 0; i < n / 2; i++) {
        const home = ids[i];
        const away = ids[n - 1 - i];
        if (home !== null && away !== null) {
          matches.push({
            round: r + 1 + leg * roundsPerLeg,
            home: leg % 2 === 0 ? home : away,
            away: leg % 2 === 0 ? away : home,
          });
        }
      }
      const last = ids.pop();
      ids.splice(1, 0, last);
    }
  }

  return matches;
}
