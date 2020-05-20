import GameObject from './GameObject';
import chroma from 'chroma-js';

export const VECTOR_BASE_LENGTH = 20;
export const VECTOR_MIN_LENGTH = VECTOR_BASE_LENGTH / 2;

export default class FieldVector extends GameObject {
  constructor(x, y, fx, fy) {
    super(x, y, 0, 0);
    this.fx = fx;
    this.fy = fy;
    this.force = Math.sqrt(Math.pow(fx, 2) + Math.pow(fy, 2));
    this.length = VECTOR_BASE_LENGTH;
    this.color = '#000';
    this.scale = chroma.scale(['#FFD151', '#2958AA']);
  }

  update(delta) {}

  render(ctx) {
    const angle = Math.atan2(this.fy, this.fx);
    const dx = Math.cos(angle) * this.length;
    const dy = Math.sin(angle) * this.length;
    let oldColor = ctx.fillStyle;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arrow(this.x - dx, this.y - dy, this.x + dx, this.y + dy, [
      0,
      1,
      -10,
      1,
      -10,
      5,
    ]);
    ctx.fill();
    ctx.fillStyle = oldColor;
  }

  calculateLength(medianForce) {
    const frac = this.force / medianForce;

    if (frac < 1 / 2) {
      this.length = VECTOR_MIN_LENGTH;
    } else if (frac > 1) {
      this.length = VECTOR_BASE_LENGTH;
    } else {
      this.length = frac * VECTOR_BASE_LENGTH;
    }
  }

  calculateColor(medianForce) {
    let frac = this.force / medianForce;

    if (frac > 1) {
      frac = 1;
    }

    this.color = this.scale(frac).hex();
  }
}
