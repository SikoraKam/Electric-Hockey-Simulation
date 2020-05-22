import ElectricCharge from './ElectricCharge';
import { CHARGE_SIZE, ELECTRIC_CHARGE_TYPE } from '../../const/charge.const';
import {
  PUCK_MASS,
  PUCK_POSITION,
  PUCK_RADIUS,
  PUCK_VELOCITY_DIVIDER,
} from '../../const/puck.const';

import Trace from '../Trace';
import { FORCE_FACTOR, VERLET_STEP_FACTOR } from '../../const/physics.const';

export default class Puck extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.NEGATIVE);
    this.acceleration = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.mass = PUCK_MASS;
    this.radius = PUCK_RADIUS;
    this.traceIsActive = false;
    this.trace = new Trace();
  }

  update(dt) {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.trace.previousPosition.push({ x: this.x, y: this.y });

    this.move(
      this.x + (this.velocity.x / PUCK_VELOCITY_DIVIDER) * dt,
      this.y + (this.velocity.y / PUCK_VELOCITY_DIVIDER) * dt
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

    if (this.traceIsActive === true) {
      this.trace.render(ctx);
    }

    ctx.stroke();
  }

  reset() {
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.trace.resetTrace();
  }
}
