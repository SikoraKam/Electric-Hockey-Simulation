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
import {
  HOCKEY_GOAL_OBSTACLES_POSITION,
  HOCKEY_GOAL_POSITION,
  OBSTACLES_EASY_POSITION,
  OBSTACLES_HARD_POSITION,
  OBSTACLES_MEDIUM_POSITION,
} from './const/positions.const';
import ChargesGenerator from './models/ChargesGenerator';
const canvas = document.querySelector('.js-canvas');

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
      custom: new Group(),
    };

    this.groups = {
      background: new Group(),
      puck: new Group(),
      charges: new Group(),
      goal: new Group(),
      obstacles: this.obstacles.training,
      obstaclesForGoal: new Group(),
      chargesGenerator: new Group(),
    };
    this.eventBus = eventBus;

    this.vectorField = new VectorField(this);
    this.groups.background.add(...this.vectorField.makeVectors());

    this.goal = new HockeyGoal(
      HOCKEY_GOAL_POSITION.X,
      HOCKEY_GOAL_POSITION.Y,
      20,
      60
    );
    this.groups.goal.add(this.goal);

    this.puck = new Puck(PUCK_POSITION.X, PUCK_POSITION.Y);
    this.groups.puck.add(this.puck);

    this.chargesGenerator = new ChargesGenerator(
      (canvas.clientWidth / 12) * 4,
      canvas.clientHeight / 2 - 5,
      15,
      15
    );
    this.groups.chargesGenerator.add(this.chargesGenerator);

    this.gameDifficulty = GAME_DIFFICULTY.TRAINING;
    this.createObstacles();

    this.tries = 0;
    this.chargesCounter = 0;

    this.listOfMovingCharges = [];
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
    if (this.gameDifficulty === GAME_DIFFICULTY.CUSTOM) {
      this.handleMovingCharges();
    }
  }

  isChargeOnScreen(charge, offset = 20) {
    return (
      charge.x > 0 - offset &&
      charge.x < canvas.clientWidth + offset &&
      charge.y > 0 - offset &&
      charge.y < canvas.clientHeight + offset
    );
  }

  handleMovingCharges() {
    this.listOfMovingCharges.forEach((charge) => {
      charge.moveCharge();
    });

    this.listOfMovingCharges = this.listOfMovingCharges.reduce(
      (charges, charge) => {
        if (this.isChargeOnScreen(charge)) {
          charge.moveCharge();
          charges.push(charge);
        } else {
          charge.active = false;
        }
        return charges;
      },
      []
    );

    if (this.vectorField.isActive) {
      this.groups.background.removeAll();
      this.groups.background.add(...this.vectorField.makeVectors());
    }
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
    if (this.goal.intersects(this.puck)) {
      this.eventBus.emit(EVENTS.GOAL);
    }

    this.groups.obstacles.objects.forEach((obstacle) => {
      if (
        this.puck.intersects(obstacle) ||
        this.puck.contains(obstacle) ||
        this.puck.touches(obstacle)
      ) {
        this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
        this.tries++;
        document.querySelector('.js-tries').innerHTML = this.tries;
      }
    });
    this.groups.obstaclesForGoal.objects.forEach((obstacle) => {
      if (
        this.puck.intersects(obstacle) ||
        this.puck.contains(obstacle) ||
        this.puck.touches(obstacle)
      ) {
        this.eventBus.emit(EVENTS.OBSTACLE_COLLISION);
        this.tries++;
        document.querySelector('.js-tries').innerHTML = this.tries;
      }
    });
  }

  updateForces() {
    this.netForce = { x: 0, y: 0 };

    this.forces = this.forces.filter((force) => {
      if (!force.charge1.active || !force.charge2.active) {
        return false;
      }

      force.calculate();

      this.netForce.x += force.x;
      this.netForce.y += force.y;

      return true;
    });
  }

  createObstacles() {
    this.groups.obstaclesForGoal.add(
      new Obstacle(
        HOCKEY_GOAL_OBSTACLES_POSITION.OBSTACLE1.X,
        HOCKEY_GOAL_OBSTACLES_POSITION.OBSTACLE1.Y,
        canvas.clientWidth * 0.029,
        canvas.clientHeight * 0.01005,
        true
      ),
      new Obstacle(
        HOCKEY_GOAL_OBSTACLES_POSITION.OBSTACLE2.X,
        HOCKEY_GOAL_OBSTACLES_POSITION.OBSTACLE2.Y,
        canvas.clientWidth * 0.0039,
        canvas.clientHeight * 0.1105,
        true
      ),
      new Obstacle(
        HOCKEY_GOAL_OBSTACLES_POSITION.OBSTACLE3.X,
        HOCKEY_GOAL_OBSTACLES_POSITION.OBSTACLE3.Y,
        canvas.clientWidth * 0.0286,
        canvas.clientHeight * 0.01005,
        true
      )
    );

    this.obstacles.easy.add(
      new Obstacle(
        OBSTACLES_EASY_POSITION.X,
        OBSTACLES_EASY_POSITION.Y,
        canvas.clientWidth * 0.0097,
        canvas.clientHeight * 0.1842
      )
    );
    this.obstacles.medium.add(
      new Obstacle(
        OBSTACLES_MEDIUM_POSITION.OBSTACLE1.X,
        OBSTACLES_MEDIUM_POSITION.OBSTACLE1.Y,
        canvas.clientWidth * 0.0097,
        canvas.clientHeight * 0.704
      ),
      new Obstacle(
        OBSTACLES_MEDIUM_POSITION.OBSTACLE2.X,
        OBSTACLES_MEDIUM_POSITION.OBSTACLE2.Y,
        canvas.clientWidth * 0.0097,
        canvas.clientHeight * 0.502
      )
    );
    this.obstacles.hard.add(
      new Obstacle(
        OBSTACLES_HARD_POSITION.OBSTACLE1.X,
        OBSTACLES_HARD_POSITION.OBSTACLE1.Y,
        canvas.clientWidth * 0.0097,
        canvas.clientHeight * 0.335
      ),
      new Obstacle(
        OBSTACLES_HARD_POSITION.OBSTACLE2.X,
        OBSTACLES_HARD_POSITION.OBSTACLE2.Y,
        canvas.clientWidth * 0.1367,
        canvas.clientHeight * 0.025
      ),
      new Obstacle(
        OBSTACLES_HARD_POSITION.OBSTACLE3.X,
        OBSTACLES_HARD_POSITION.OBSTACLE3.Y,
        canvas.clientWidth * 0.0097,
        canvas.clientHeight * 0.435
      ),
      new Obstacle(
        OBSTACLES_HARD_POSITION.OBSTACLE4.X,
        OBSTACLES_HARD_POSITION.OBSTACLE4.Y,
        canvas.clientWidth * 0.0097,
        this.canvas.clientHeight
      )
    );
    this.obstacles.custom.add(
      new Obstacle(
        this.chargesGenerator.x + 3,
        this.chargesGenerator.y + 3,
        this.chargesGenerator.width,
        this.chargesGenerator.height
      )
    );
  }

  extendEnvironment() {
    canvasArrowFunction();
  }
}
