import ElectricCharge from './ElectricCharge';
import { ELECTRIC_CHARGE_TYPE } from '../../const/charge.const';

import { GAME_DIFFICULTY } from '../../const/game.const';

export default class PositiveCharge extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.POSITIVE);
  }

  moveCharge() {
    const randomDirection = 2 * Math.PI * Math.random();
    const randomSpeed = Math.floor(Math.random() * 100);

    this.move(
      this.x + randomSpeed * Math.sin(randomDirection),
      this.y + randomSpeed * -Math.cos(randomDirection)
    );
  }
}
