import GameObject from './GameObject';

export default class Vector extends GameObject {
  constructor(x, y, fx, fy) {
    super(x, y, 0, 0);
    this.radius = 2;
    this.fx = fx;
    this.fy = fy;
  }

  update(delta) {}

  render(ctx) {
    const VEC_LEN = 20;
    const angle = Math.atan2(this.fy, this.fx);
    const color = this.getVectorColor(this.fy, 1);
    const dx = Math.cos(angle) * VEC_LEN;
    const dy = Math.sin(angle) * VEC_LEN;

    ctx.beginPath();
    ctx.strokeStyle = this.getVectorColor(this.fx, 1);
    ctx.moveTo(this.x + dx, this.y + dy);
    ctx.lineTo(this.x - dx, this.y - dy);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.stroke();
  }

  getVectorColor(force, cap) {
    const frac = force / cap;

    if (frac < 1 / 3) {
      return 'blue';
    }

    if (frac < 2 / 3) {
      return 'green';
    }

    return 'red';
  }
}
