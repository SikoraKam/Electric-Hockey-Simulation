import GameObject from './GameObject';
import PositiveCharge from './physics/PositiveCharge';
import { PUCK_VELOCITY_DIVIDER } from '../const/puck.const';

export default class ChargesGenerator extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.isActive = false;
  }

  update(delta) {}

  render(ctx) {
    if (this.isActive) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.stroke();
    }
  }

  generateCharge() {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const charge = new PositiveCharge(centerX, centerY);

    const randomDirection = 2 * Math.PI * Math.random();
    const randomSpeed = Math.floor(Math.random() * 11);

    charge.move(
      charge.x + randomSpeed * Math.sin(randomDirection),
      charge.y + randomSpeed * -Math.cos(randomDirection)
    );
  }

  startTimer() {
    this.tid = setInterval(this.generateCharge(), 5000);
  }

  abortTimer() {
    clearInterval(this.tid);
  }
}
