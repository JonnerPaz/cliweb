export const SPORTS = {
  football: {
    id: "football",
    name: "Fútbol",
    eventName: "Gol",
    gf: "GF",
    gc: "GC",
    scorers: "Goleadores",
    icon: "⚽",
  },
  basketball: {
    id: "basketball",
    name: "Básquet",
    eventName: "Canasta",
    gf: "PF",
    gc: "PC",
    scorers: "Encestadores",
    icon: "🏀",
  },
  tennis: {
    id: "tennis",
    name: "Tenis",
    eventName: "Punto",
    gf: "PF",
    gc: "PC",
    scorers: "Punteadores",
    icon: "🎾",
  },
};

export function getSportTerms(sportId) {
  return SPORTS[sportId] || SPORTS.football;
}

export function getSportList() {
  return Object.values(SPORTS);
}
