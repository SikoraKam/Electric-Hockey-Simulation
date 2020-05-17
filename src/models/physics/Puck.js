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
    this.previousPos = { x, y };
    this.mass = PUCK_MASS;
    this.radius = PUCK_RADIUS;
    this.traceIsActive = false;
    this.trace = new Trace();
  }

  update(dt) {
    dt /= VERLET_STEP_FACTOR;

    const newX =
      2 * this.x -
      this.previousPos.x +
      ((FORCE_FACTOR * this.acceleration.x) / this.mass) * dt * dt;
    const newY =
      2 * this.y -
      this.previousPos.y +
      ((FORCE_FACTOR * this.acceleration.y) / this.mass) * dt * dt;

    this.previousPos = { x: this.x, y: this.y };
    this.trace.previousPosition.push(this.previousPos);
    this.move(newX, newY);
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
}
