const canvas = document.querySelector('.js-canvas');

export const HOCKEY_GOAL_POSITION = {
  X: (canvas.clientWidth / 3) * 2,
  Y: canvas.clientHeight / 2 - 30,
};

export const HOCKEY_GOAL_OBSTACLES_POSITION = {
  OBSTACLE1: { X: HOCKEY_GOAL_POSITION.X - 20, Y: HOCKEY_GOAL_POSITION.Y - 9 },
  OBSTACLE2: { X: HOCKEY_GOAL_POSITION.X + 24, Y: HOCKEY_GOAL_POSITION.Y - 2 },
  OBSTACLE3: { X: HOCKEY_GOAL_POSITION.X - 20, Y: HOCKEY_GOAL_POSITION.Y + 63 },
};

export const OBSTACLES_EASY_POSITION = {
  X: canvas.clientWidth / 3,
  Y: canvas.clientHeight / 2,
};
export const OBSTACLES_MEDIUM_POSITION = {
  OBSTACLE1: { X: canvas.clientWidth / 5, Y: 0 },
  OBSTACLE2: { X: (canvas.clientWidth / 5) * 2, Y: canvas.clientHeight / 2 },
};
export const OBSTACLES_HARD_POSITION = {
  OBSTACLE1: {
    X: canvas.clientWidth / 5 - 97,
    Y: canvas.clientHeight / 5 + 44,
  },
  OBSTACLE2: { X: 0, Y: canvas.clientHeight / 2 + 50 },
  OBSTACLE3: { X: (canvas.clientWidth / 7) * 3, Y: 0 },
  OBSTACLE4: {
    X: (canvas.clientWidth / 7) * 3,
    Y: canvas.clientHeight / 2 + 63,
  },
};
