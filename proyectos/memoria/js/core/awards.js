/**
 * Sistema de Awards de Pokemory
 * Define los criterios de los awards y verifica si se desbloquean
 */

export const AwardType = {
  // Tipos de awards
  LUCKY_START: 'lucky_start',
  PERFECT_MATCH: 'perfect_match',
  SPEED_DEMON: 'speed_demon',
  MEMORY_MASTER: 'memory_master',
  PVP_CHAMPION: 'pvp_champion',
  STREAK_COMMON: 'streak_common',
  STREAK_MASTER: 'streak_master'
};

export const AWARD_DEFINITIONS = {
  [AwardType.LUCKY_START]: {
    id: AwardType.LUCKY_START,
    name: 'Inicio Afortunado',
    description: 'Encuentra tu primer par en el primer turno',
    icon: '🍀',
    rarity: 'common'
  },
  [AwardType.PERFECT_MATCH]: {
    id: AwardType.PERFECT_MATCH,
    name: 'Memoria Perfecta',
    description: 'Completa el juego sin errores (100% precisión)',
    icon: '💎',
    rarity: 'legendary'
  },
  [AwardType.SPEED_DEMON]: {
    id: AwardType.SPEED_DEMON,
    name: 'Relámpago',
    description: 'Completa el juego en tiempo record.',
    icon: '⚡',
    rarity: 'epic'
  },
  [AwardType.MEMORY_MASTER]: {
    id: AwardType.MEMORY_MASTER,
    name: 'Maestro de la Memoria',
    description: 'Completa el juego en dificultad difícil',
    icon: '🔥',
    rarity: 'rare'
  },
  [AwardType.PVP_CHAMPION]: {
    id: AwardType.PVP_CHAMPION,
    name: 'Campeón PvP',
    description: 'Gana una partida en modo PvP',
    icon: '🏆',
    rarity: 'epic'
  },
  [AwardType.STREAK_COMMON]: {
    id: AwardType.STREAK_,
    name: 'Aprendiz de Racha',
    description: 'Encuentra 3 pares seguidos sin errores',
    icon: '⭐',
    rarity: 'common' 
  },
  [AwardType.STREAK_MASTER]: {
    id: AwardType.STREAK_MASTER,
    name: 'Racha Impecable',
    description: 'Encuentra 5 pares seguidos sin errores',
    icon: '🌟',
    rarity: 'rare'
  }
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

  /**
   * Verifica si se desbloquean awards basado en el rendimiento del juego
   * @param {Object} gameData - Datos de rendimiento del juego
   * @returns {Array} - Array de awards recién desbloqueados
   */

  checkAwards(gameData) {
    const newAwards = [];

    // Verifica Inicio Afortunado: primer par en el primer turno
    if (gameData.firstMoveMatch && !this.unlockedAwards.has(AwardType.LUCKY_START)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.LUCKY_START]);
      this.unlockedAwards.add(AwardType.LUCKY_START);
    }

    // Verifica Memoria Perfecta (100% de precisión)
    const accuracy = gameData.totalPairs > 0 
      ? (gameData.totalPairs / gameData.totalMovements) * 100 
      : 0;
    
    if (accuracy >= 100 && !this.unlockedAwards.has(AwardType.PERFECT_MATCH)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.PERFECT_MATCH]);
      this.unlockedAwards.add(AwardType.PERFECT_MATCH);
    }

    // Verifica Demonio de Velocidad (<= 30s general, o <= 60s en Difícil o Medio)
    const time = gameData.time;
    const isTimeValid = time !== undefined && time !== null;
    const isFastEnough = (gameData.difficulty === 'Medio' && time <= 180) || 
    (gameData.difficulty === 'Dificil' && time <= 120) || (time <= 30);

    if (isTimeValid && isFastEnough && !this.unlockedAwards.has(AwardType.SPEED_DEMON)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.SPEED_DEMON]);
      this.unlockedAwards.add(AwardType.SPEED_DEMON);
    }

    // Verifica Maestro de Memoria (Modo difícil)
    if (gameData.difficulty === 'Dificil' && !this.unlockedAwards.has(AwardType.MEMORY_MASTER)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.MEMORY_MASTER]);
      this.unlockedAwards.add(AwardType.MEMORY_MASTER);
    }

    // Verifica Campeón PvP
    if (gameData.gameMode === 'pvp' && gameData.winner && !this.unlockedAwards.has(AwardType.PVP_CHAMPION)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.PVP_CHAMPION]);
      this.unlockedAwards.add(AwardType.PVP_CHAMPION);
    }

    // Verifica Maestro de Racha
    if (this.maxStreak >= 3 && !this.unlockedAwards.has(AwardType.STREAK_COMMON)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.STREAK_COMMON]);
      this.unlockedAwards.add(AwardType.STREAK_COMMON);
    }

    // Verifica Maestro de Racha
    if (this.maxStreak >= 5 && !this.unlockedAwards.has(AwardType.STREAK_MASTER)) {
      newAwards.push(AWARD_DEFINITIONS[AwardType.STREAK_MASTER]);
      this.unlockedAwards.add(AwardType.STREAK_MASTER);
    }

    return newAwards;
  }

  // Actualiza la racha cuando se encuentra una coincidencia
  onMatch() {
    this.currentStreak++;
    this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
  }

  // Reinicia la racha cuando falla una coincidencia
  onMismatch() {
    this.currentStreak = 0;
  }

  // Obtiene todos los awards desbloqueados
  getUnlockedAwards() {
    return Array.from(this.unlockedAwards).map(id => AWARD_DEFINITIONS[id]);
  }

  //Obtiene un award por su ID
  getAwardById(id) {
    return AWARD_DEFINITIONS[id];
  }
}

// Instancia singleton
export default new AwardChecker();
