import ElectricCharge from './ElectricCharge';
import { ELECTRIC_CHARGE_TYPE } from '../../const/charge.const';

export default class PositiveCharge extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.POSITIVE);
    this.randomDirection = 2 * Math.PI * Math.random();
    this.randomSpeed = Math.floor(Math.random() * 20);
  }

  moveCharge() {
    this.move(
      this.x + randomSpeed * Math.sin(randomDirection),
      this.y + randomSpeed * -Math.cos(randomDirection)
    );
  }
}
