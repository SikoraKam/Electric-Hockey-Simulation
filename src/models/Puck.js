import ElectricCharge from './ElectricCharge';
import { CHARGE_SIZE, ELECTRIC_CHARGE_TYPE } from '../const/charge.const';
import {
  PUCK_POSITION,
  PUCK_RADIUS,
  PUCK_VELOCITY_DIVIDER,
} from '../const/puck.const';

export default class Puck extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.NEGATIVE);
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.radius = PUCK_RADIUS;
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
  render(ctx) {
    const centerX = this.x + CHARGE_SIZE / 2;
    const centerY = this.y + CHARGE_SIZE / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.stroke();
  }
}
