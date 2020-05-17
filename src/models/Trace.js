import { PUCK_POSITION } from '../const/puck.const';
import { CHARGE_SIZE } from '../const/charge.const';

export default class Trace {
  constructor() {
    this.previousPosition = [];
  }

  render(ctx) {
    ctx.beginPath();
    ctx.moveTo(
      PUCK_POSITION.X + CHARGE_SIZE / 2,
      PUCK_POSITION.Y + CHARGE_SIZE / 2
    );
    const len = this.previousPosition.length;
    for (let i = 0; i < len; i++) {
      ctx.lineTo(
        this.previousPosition[i].x + CHARGE_SIZE / 2,
        this.previousPosition[i].y + CHARGE_SIZE / 2
      );
    }
    ctx.stroke();
  }

  resetTrace() {
    this.previousPosition = [];
  }
}
