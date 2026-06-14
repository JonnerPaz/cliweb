export const AwardType = {
  LUCKY_START: "lucky_start",
  PERFECT_MATCH: "perfect_match",
  SPEED_DEMON: "speed_demon",
  MEMORY_MASTER: "memory_master",
  PVP_CHAMPION: "pvp_champion",
  STREAK_COMMON: "streak_common",
  STREAK_MASTER: "streak_master",
};

export const AWARD_DEFINITIONS = {
  [AwardType.LUCKY_START]: {
    id: AwardType.LUCKY_START,
    name: "Inicio Afortunado",
    description: "Encuentra tu primer par en el primer turno",
    icon: "🍀",
    rarity: "common",
  },
  [AwardType.PERFECT_MATCH]: {
    id: AwardType.PERFECT_MATCH,
    name: "Memoria Perfecta",
    description: "Completa el juego sin errores (100% precisión)",
    icon: "💎",
    rarity: "legendary",
  },
  [AwardType.SPEED_DEMON]: {
    id: AwardType.SPEED_DEMON,
    name: "Relámpago",
    description: "Completa el juego en tiempo record.",
    icon: "⚡",
    rarity: "epic",
  },
  [AwardType.MEMORY_MASTER]: {
    id: AwardType.MEMORY_MASTER,
    name: "Maestro de la Memoria",
    description: "Completa el juego en dificultad difícil",
    icon: "🔥",
    rarity: "rare",
  },
  [AwardType.PVP_CHAMPION]: {
    id: AwardType.PVP_CHAMPION,
    name: "Campeón PvP",
    description: "Gana una partida en modo PvP",
    icon: "🏆",
    rarity: "epic",
  },
  [AwardType.STREAK_COMMON]: {
    id: AwardType.STREAK_COMMON,
    name: "Aprendiz de Racha",
    description: "Encuentra 3 pares seguidos sin errores",
    icon: "⭐",
    rarity: "common",
  },
  [AwardType.STREAK_MASTER]: {
    id: AwardType.STREAK_MASTER,
    name: "Racha Impecable",
    description: "Encuentra 5 pares seguidos sin errores",
    icon: "🌟",
    rarity: "rare",
  },
};

export class AwardChecker {
  constructor() {
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.unlockedAwards = new Set();
  }

  reset() {
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.unlockedAwards.clear();
  }

  checkAwards(gameData) {
    const midGame = this.checkMidGameAwards(gameData);
    const endGame = this.#getEndGameAwards(gameData);
    return [...midGame, ...endGame];
  }

  checkMidGameAwards(gameData) {
    return [
      this.#unlockIfEligible(AwardType.LUCKY_START, gameData.firstMoveMatch),
      this.#unlockIfEligible(AwardType.STREAK_COMMON, this.maxStreak >= 3),
      this.#unlockIfEligible(AwardType.STREAK_MASTER, this.maxStreak >= 5),
    ].filter(Boolean);
  }

  #getEndGameAwards(gameData) {
    const accuracy =
      gameData.totalPairs > 0
        ? (gameData.totalPairs / gameData.totalMovements) * 100
        : 0;

    // tiempos según dificultad de juego
    const isFastEnough =
      (gameData.difficulty === "Medio" && gameData.time <= 60) ||
      (gameData.difficulty === "Dificil" && gameData.time <= 120) ||
      gameData.time <= 30;

    const hasValidTime = gameData.time != null;

    return [
      this.#unlockIfEligible(AwardType.PERFECT_MATCH, accuracy >= 100),
      this.#unlockIfEligible(
        AwardType.SPEED_DEMON,
        hasValidTime && isFastEnough
      ),
      this.#unlockIfEligible(
        AwardType.MEMORY_MASTER,
        gameData.difficulty === "Dificil"
      ),
      this.#unlockIfEligible(
        AwardType.PVP_CHAMPION,
        gameData.gameMode === "pvp" && gameData.winner
      ),
    ].filter(Boolean);
  }

  #unlockIfEligible(type, condition) {
    if (condition && !this.unlockedAwards.has(type)) {
      this.unlockedAwards.add(type);
      return AWARD_DEFINITIONS[type];
    }
    return null;
  }

  onMatch() {
    this.currentStreak++;
    this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
  }

  onMismatch() {
    this.currentStreak = 0;
  }

  getUnlockedAwards() {
    return Array.from(this.unlockedAwards).map((id) => AWARD_DEFINITIONS[id]);
  }

  getAwardById(id) {
    return AWARD_DEFINITIONS[id];
  }
}

export default new AwardChecker();
