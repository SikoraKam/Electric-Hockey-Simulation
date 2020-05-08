import ElectricCharge from './ElectricCharge';
import { ELECTRIC_CHARGE_TYPE } from '../const/charge.const';
import { PUCK_VELOCITY_DIVIDER } from '../const/puck.const';

export default class Puck extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.POSITIVE);
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
  }

  update(delta) {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.move(
      this.x + (this.velocity.x / PUCK_VELOCITY_DIVIDER) * delta,
      this.y + (this.velocity.y / PUCK_VELOCITY_DIVIDER) * delta
    );

    this.acceleration = { x: 0, y: 0 };
  }
}
