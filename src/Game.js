import MainLoop from 'mainloop.js';
import Group from './models/Group';
import Puck from './models/physics/Puck';
import { GAME_DIFFICULTY } from './const/game.const';
import { PUCK_POSITION } from './const/puck.const';
import HockeyGoal from './models/HockeyGoal';
import EVENTS from './const/events.const';
import eventBus from './events/EventBus';
import Obstacle from './models/Obstacle';
import VectorField from './models/VectorField';
import { canvasArrowFunction } from './extensions/dom';

export default class Game {
  constructor() {
    this.setup();
    this.bindLoopFunctions();

    this.forces = [];
    this.netForce = { x: 0, y: 0 };

    this.obstacles = {
      training: new Group(),
      easy: new Group(),
      medium: new Group(),
      hard: new Group(),
    };

    this.groups = {
      background: new Group(),
      puck: new Group(),
      charges: new Group(),
      goal: new Group(),
      obstacles: this.obstacles.training,
      obstaclesForGoal: new Group(),
    };
    this.eventBus = eventBus;

    this.vectorField = new VectorField(this);
    this.groups.background.add(...this.vectorField.makeVectors());

    this.goal = new HockeyGoal(700, 270, 20, 60);
    this.groups.goal.add(this.goal);

    this.puck = new Puck(PUCK_POSITION.X, PUCK_POSITION.Y);
    this.groups.puck.add(this.puck);

    this.gameDifficulty = GAME_DIFFICULTY.TRAINING;
    this.createObstacles();

    this.tries = 0;
    this.chargesCounter = 0;
  }

  setup() {
    this.extendEnvironment();

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
    this.updateForces();
    this.puck.acceleration = this.netForce;

    Object.values(this.groups).forEach((group) => group.update(delta));
    this.handleCollisions();
  }

  reset() {
    this.puck.reset();
    this.puck.move(PUCK_POSITION.X, PUCK_POSITION.Y);
    this.puck.previousPos = { x: PUCK_POSITION.X, y: PUCK_POSITION.Y };
  }

  render() {
    this.clear();
    Object.values(this.groups).forEach((group) => group.render(this.ctx));
  }

  handleCollisions() {
    if (this.goal.touches(this.puck)) {
      this.eventBus.emit(EVENTS.GOAL);
    }

    this.groups.obstacles.objects.forEach((obstacle) => {
      if (this.puck.touches(obstacle)) {
        this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
        this.tries++;
        document.querySelector('.js-tries').innerHTML = this.tries;
      }
    });
    this.groups.obstaclesForGoal.objects.forEach((obstacle) => {
      if (this.puck.touches(obstacle)) {
        this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
        this.tries++;
        document.querySelector('.js-tries').innerHTML = this.tries;
      }
    });
  }

  updateForces() {
    this.netForce = { x: 0, y: 0 };

    this.forces.forEach((force) => {
      force.calculate();

      this.netForce.x += force.x;
      this.netForce.y += force.y;
    });
  }

  createObstacles() {
    this.groups.obstaclesForGoal.add(
      new Obstacle(680, 267, 42, 1, true),
      new Obstacle(722, 269, 1, 62, true),
      new Obstacle(680, 332, 42, 1, true)
    );

    this.obstacles.easy.add(new Obstacle(350, 300, 10, 70));
    this.obstacles.medium.add(
      new Obstacle(250, 0, 10, 400),
      new Obstacle(450, 300, 10, 300)
    );
    this.obstacles.hard.add(
      new Obstacle(200, 170, 10, 200),
      new Obstacle(0, 370, 210, 10),
      new Obstacle(500, 340, 10, 500),
      new Obstacle(500, 0, 10, 270)
    );
  }

  extendEnvironment() {
    canvasArrowFunction();
  }
}
