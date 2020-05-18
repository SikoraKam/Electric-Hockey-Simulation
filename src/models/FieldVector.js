import GameObject from './GameObject';

export default class FieldVector extends GameObject {
  constructor(x, y, fx, fy) {
    super(x, y, 0, 0);
    this.fx = fx;
    this.fy = fy;
  }

  update(delta) {}

  render(ctx) {
    const VEC_LEN = 20;
    const angle = Math.atan2(this.fy, this.fx);
    const dx = Math.cos(angle) * VEC_LEN;
    const dy = Math.sin(angle) * VEC_LEN;

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
  }
}
