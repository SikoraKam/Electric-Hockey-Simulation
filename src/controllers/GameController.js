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
    this.eventBus.on(EVENTS.GOAL, () => {
      //TODO:display message about endgame
      //consider also this.clear()
      this.game.reset();
    });
    this.eventBus.on(EVENTS.OBSTACLE_COLLISION, () => {
      //TODO:display message about endgame
      //consider also this.clear()
      this.game.reset();
    });
  }

  clear() {
    this.game.reset();
    this.game.groups.charges.removeAll();
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
        break;
      case GAME_DIFFICULTY.EASY:
        this.game.groups.obstacles = this.game.obstacles.easy;
        break;
      case GAME_DIFFICULTY.MEDIUM:
        this.game.groups.obstacles = this.game.obstacles.medium;
        break;
      case GAME_DIFFICULTY.HARD:
        this.game.groups.obstacles = this.game.obstacles.hard;
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
    this.game.groups.background.removeAll();
    this.game.groups.background.add(...this.game.vectorField.getFieldVectors());
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
}
