import MainLoop from 'mainloop.js';
import Group from './models/Group';
import Puck from './models/Puck';
import { K_CONST } from './const/game.const';
import { GAME_DIFFICULTY } from './const/game.const';
import { PUCK_POSITION, PUCK_MASS } from './const/puck.const';
import HockeyGoal from './models/HockeyGoal';
import EVENTS from './const/events.const';
import eventBus from './events/EventBus';
import Obstacle from './models/Obstacle';

export default class Game {
  constructor() {
    this.setup();
    this.bindLoopFunctions();

    this.groups = {
      puck: new Group(),
      charges: new Group(),
      goal: new Group(),
      obstaclesForEasy: new Group(),
      obstaclesForMedium: new Group(),
      obstaclesForHard: new Group(),
    };
    this.eventBus = eventBus;

    this.goal = new HockeyGoal(700, 270, 40, 60);
    this.groups.goal.add(this.goal);

    this.puck = new Puck(PUCK_POSITION.X, PUCK_POSITION.Y);
    this.groups.puck.add(this.puck);

    this.chargeMass = PUCK_MASS;

    this.gameDifficulty = GAME_DIFFICULTY.TRAINING;

    this.createObstacles();
  }

  setup() {
    this.loop = MainLoop;
    this.canvas = document.querySelector('.js-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.setCanvasAspectRatio();
    window.addEventListener('resize', this.setCanvasAspectRatio.bind(this));
  }

  bindLoopFunctions() {
    MainLoop.setUpdate(this.update.bind(this));
    MainLoop.setDraw(this.render.bind(this));
  }

  setCanvasAspectRatio() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(delta) {
    this.puck.acceleration = this.calculateFieldForce();
    Object.values(this.groups).forEach((group) => group.update(delta));

    this.handleCollisions();
  }

  reset() {
    this.puck.velocity = { x: 0, y: 0 };
    this.puck.acceleration = { x: 0, y: 0 };
    this.puck.move(PUCK_POSITION.X, PUCK_POSITION.Y);
  }

  render() {
    this.clear();
    Object.values(this.groups).forEach((group) => group.render(this.ctx));
  }

  handleCollisions() {
    if (this.goal.touches(this.puck)) {
      this.eventBus.emit(EVENTS.GOAL);
    }

    if (this.gameDifficulty === GAME_DIFFICULTY.EASY) {
      this.obstaclesForEasy.forEach((obstacle) => {
        if (this.puck.touches(obstacle))
          this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
      });
    }

    if (this.gameDifficulty === GAME_DIFFICULTY.MEDIUM) {
      this.obstaclesForMedium.forEach((obstacle) => {
        if (this.puck.touches(obstacle))
          this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
      });
    }

    if (this.gameDifficulty === GAME_DIFFICULTY.HARD) {
      this.obstaclesForHard.forEach((obstacle) => {
        if (this.puck.touches(obstacle))
          this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
      });
    }
  }

  calculateFieldForce() {
    const puck = this.puck;
    const chargeMass = this.chargeMass;
    const force = { x: 0, y: 0 };

    this.groups.charges.objects.forEach((charge) => {
      const r = charge.distance(puck);

      const sin = (charge.x - puck.x) / r;
      const cos = (charge.y - puck.y) / r;
      const repelling = charge.type === puck.type ? -1 : 1;

      force.x += repelling * (sin / (Math.pow(r, 2) * chargeMass)) * K_CONST;
      force.y += repelling * (cos / (Math.pow(r, 2) * chargeMass)) * K_CONST;
    });

    return force;
  }

  createObstacles() {
    this.obstaclesForEasy = [new Obstacle(200, 200, 80, 80)];
    this.obstaclesForEasy.forEach((obstacle) =>
      this.groups.obstaclesForEasy.add(obstacle)
    );
    this.obstaclesForMedium = [
      // new Obstacle(200, 200, 10, 40),
      new Obstacle(400, 400, 60, 10),
    ];
    this.obstaclesForMedium.forEach((obstacle) =>
      this.groups.obstaclesForMedium.add(obstacle)
    );
    this.obstaclesForHard = [
      // new Obstacle(200, 200, 10, 40),
      //new Obstacle(400, 400, 60, 10),
      new Obstacle(500, 500, 80, 5),
    ];
    this.obstaclesForHard.forEach((obstacle) =>
      this.groups.obstaclesForHard.add(obstacle)
    );
  }
}
