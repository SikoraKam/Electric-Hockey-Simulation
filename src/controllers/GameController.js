import EVENTS from '../const/events.const';
import { CHARGE_SIZE, ELECTRIC_CHARGE_TYPE } from '../const/charge.const';
import Controller from './Controller';
import NegativeCharge from '../models/physics/NegativeCharge';
import PositiveCharge from '../models/physics/PositiveCharge';
import { GAME_DIFFICULTY } from '../const/game.const';
import CoulombForce from '../models/physics/CoulombForce';

export default class GameController extends Controller {
  constructor(game) {
    super();
    this.game = game;
    this.registerListeners();
  }

  start() {
    this.game.loop.start();
  }

  stop() {
    this.game.loop.stop();
  }

  registerListeners() {
    this.eventBus.on(
      EVENTS.MOUSE_LEFT_CLICK,
      this.placeCharge.bind(this, ELECTRIC_CHARGE_TYPE.NEGATIVE)
    );
    this.eventBus.on(
      EVENTS.MOUSE_RIGHT_CLICK,
      this.placeCharge.bind(this, ELECTRIC_CHARGE_TYPE.POSITIVE)
    );
    this.eventBus.on(EVENTS.MASS_CHANGE, (newMass) => {
      this.game.puck.mass = newMass;
    });
    this.eventBus.on(
      EVENTS.DIFFICULTY_CHANGE,
      this.onDifficultyChange.bind(this)
    );
    this.eventBus.on(EVENTS.GAME_RESET, () => {
      this.game.reset();
    });
    this.eventBus.on(EVENTS.GAME_CLEAR, () => {
      this.clear();
    });
    this.eventBus.on(EVENTS.GAME_START, () => {
      this.start();
    });
    this.eventBus.on(EVENTS.PAUSE_TOGGLE, () => {
      this.stop();
    });
    this.eventBus.on(EVENTS.PUCK_TOGGLE, (type) => {
      type
        ? (this.game.puck.type = ELECTRIC_CHARGE_TYPE.POSITIVE)
        : (this.game.puck.type = ELECTRIC_CHARGE_TYPE.NEGATIVE);
    });
    this.eventBus.on(EVENTS.TRACE_TOGGLE, (isActive) => {
      isActive
        ? (this.game.puck.traceIsActive = true)
        : (this.game.puck.traceIsActive = false);
    });
    this.eventBus.on(EVENTS.FIELD_TOGGLE, (isActive) => {
      if (isActive) {
        this.game.vectorField.isActive = true;
        this.game.groups.background.removeAll();
        this.game.groups.background.add(...this.game.vectorField.makeVectors());
      } else {
        this.game.vectorField.isActive = false;
        this.game.groups.background.removeAll();
      }
    });
    this.eventBus.on(EVENTS.GOAL, () => {
      this.showGoalMessageAnimation();
      this.clear();
    });
    this.eventBus.on(EVENTS.OBSTACLE_COLLISION, () => {
      this.showFailureMessageAnimation();
      this.game.reset();
    });
  }

  clear() {
    this.game.reset();
    this.game.groups.charges.removeAll();
    this.game.groups.background.removeAll();
    this.game.forces = [];
    this.game.tries = 0;
    this.game.chargesCounter = 0;
    document.querySelector('.js-charges').innerHTML = this.game.chargesCounter;
    document.querySelector('.js-tries').innerHTML = this.game.tries;
  }

  onDifficultyChange(newDifficulty) {
    this.game.gameDifficulty = newDifficulty;
    switch (this.game.gameDifficulty) {
      case GAME_DIFFICULTY.TRAINING:
        this.game.groups.obstacles = this.game.obstacles.training;
        this.game.chargesGenerator.isActive = false;
        break;
      case GAME_DIFFICULTY.EASY:
        this.game.groups.obstacles = this.game.obstacles.easy;
        this.game.chargesGenerator.isActive = false;
        break;
      case GAME_DIFFICULTY.MEDIUM:
        this.game.groups.obstacles = this.game.obstacles.medium;
        this.game.chargesGenerator.isActive = false;
        break;
      case GAME_DIFFICULTY.HARD:
        this.game.groups.obstacles = this.game.obstacles.hard;
        this.game.chargesGenerator.isActive = false;
        break;
      case GAME_DIFFICULTY.CUSTOM:
        this.game.groups.obstacles = this.game.obstacles.custom;
        this.game.chargesGenerator.isActive = true;
        break;
    }
  }

  placeCharge(type, position) {
    const { x, y } = this.getCenteredChargePosition(position);
    const charge =
      type === ELECTRIC_CHARGE_TYPE.NEGATIVE
        ? new NegativeCharge(x, y)
        : new PositiveCharge(x, y);
    this.game.forces.push(new CoulombForce(charge, this.game.puck));
    if (this.game.vectorField.isActive) {
      this.game.groups.background.removeAll();
      this.game.groups.background.add(...this.game.vectorField.makeVectors());
    }
    this.game.groups.charges.add(charge);
    this.game.chargesCounter++;
    document.querySelector('.js-charges').innerHTML = this.game.chargesCounter;
  }

  getCenteredChargePosition({ x, y }) {
    return {
      x: x - CHARGE_SIZE / 2,
      y: y - CHARGE_SIZE / 2,
    };
  }

  showGoalMessageAnimation() {
    const me = document.querySelector('.goal-message');
    me.style.display = 'block';
    me.style.animation = 'none';
    setTimeout(function () {
      me.style.animation = '';
    }, 3000);

    me.style.animation = 'goal 3s ';
    setTimeout(function () {
      me.style.display = 'none';
    }, 3000);
  }
  showFailureMessageAnimation() {
    const me = document.querySelector('.failure-message');
    me.style.display = 'block';
    me.style.animation = 'none';
    setTimeout(function () {
      me.style.animation = '';
    }, 1000);

    me.style.animation = 'failure 1s ';
    setTimeout(function () {
      me.style.display = 'none';
    }, 1000);
  }
}
