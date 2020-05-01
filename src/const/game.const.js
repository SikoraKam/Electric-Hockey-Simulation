export const GAME_DIFFICULTY = {
  TRAINING: 'TRAINING',
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',

  from(text) {
    return this[text.toUpperCase()] || null;
  },
};

export const K_CONST = 100000000;
