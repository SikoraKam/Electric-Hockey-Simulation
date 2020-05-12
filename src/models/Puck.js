import ElectricCharge from './ElectricCharge';
import { ELECTRIC_CHARGE_TYPE } from '../const/charge.const';
import { PUCK_VELOCITY_DIVIDER } from '../const/puck.const';

export default class Puck extends ElectricCharge {
  constructor(x, y) {
    super(x, y, ELECTRIC_CHARGE_TYPE.POSITIVE);
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.radius = PUCK_RADIUS;
    this.previousPosition = { x: [], y: [] };
    this.traceIsActive = false;
  }

  update(delta) {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.previousPosition.x.push(this.x);
    this.previousPosition.y.push(this.y);

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

    if (this.traceIsActive === true) {
      ctx.moveTo(
        PUCK_POSITION.X + CHARGE_SIZE / 2,
        PUCK_POSITION.Y + CHARGE_SIZE / 2
      );
      const len = this.previousPosition.x.length;
      for (let i = 0; i < len; i++) {
        ctx.lineTo(
          this.previousPosition.x[i] + CHARGE_SIZE / 2,
          this.previousPosition.y[i] + CHARGE_SIZE / 2
        );
      }
    }
    ctx.stroke();
  }

  resetTrace() {
    this.previousPosition.x = [];
    this.previousPosition.y = [];
  }
}
