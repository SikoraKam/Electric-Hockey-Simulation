import ElectricCharge from './ElectricCharge';
import { ELECTRIC_CHARGE_TYPE } from '../const/charge.const';

export default class Puck extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.POSITIVE);
    this.reset();
  }

  reset() {
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.x = 100;
    this.y = 300;
  }

  update(delta) {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.move(
      this.x + (this.velocity.x / 30000 )* delta,
      this.y + (this.velocity.y /30000)* delta
    );

    this.acceleration = { x: 0, y: 0 };
  }
}
