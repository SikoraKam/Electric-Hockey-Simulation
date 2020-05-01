import EVENTS from '../const/events.const';
import { CHARGE_SIZE, ELECTRIC_CHARGE_TYPE } from '../const/charge.const';
import Controller from './Controller';
import Puck from '../models/Puck';
import NegativeCharge from '../models/NegativeCharge';
import PositiveCharge from '../models/PositiveCharge';
import { K_CONST } from '../const/game.const';

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
