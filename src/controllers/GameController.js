import EVENTS from '../const/events.const';
import { CHARGE_SIZE, ELECTRIC_CHARGE_TYPE } from '../const/charge.const';
import Controller from './Controller';
import Puck from '../models/Puck';
import NegativeCharge from '../models/NegativeCharge';
import PositiveCharge from '../models/PositiveCharge';
import { K_CONST } from '../const/game.const';
import Group from "../models/Group";

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
      this.game.CHARGE_MASS = newMass;
    });
    this.eventBus.on(
        EVENTS.DIFFICULTY_CHANGE,
        this.onDifficultyChange.bind(this)
    );
    this.eventBus.on(
        EVENTS.GAME_RESET, () => {
          this.game.puck.reset();
        });
    this.eventBus.on(
        EVENTS.GAME_CLEAR,
        this.clearBoard.bind(this)
    );
    this.eventBus.on(
        EVENTS.GAME_START,
        () => {this.start()}
    );
    this.eventBus.on(
        EVENTS.PAUSE_TOGGLE,
        () => {this.stop()}
    );

  }

  clearBoard(){
    this.game.puck.reset();
    this.game.groups.charges.removeAll();
  }

  onDifficultyChange(newDifficulty){
    this.game.gameDifficulty = newDifficulty;
  }

  placeCharge(type, position) {
    const { x, y } = this.getCenteredChargePosition(position);
    const charge =
      type === ELECTRIC_CHARGE_TYPE.NEGATIVE
        ? new NegativeCharge(x, y)
        : new PositiveCharge(x, y);
    this.game.groups.charges.add(charge);
  }

  getCenteredChargePosition({ x, y }) {
    return {
      x: x - CHARGE_SIZE / 2,
      y: y - CHARGE_SIZE / 2,
    };
  }

}