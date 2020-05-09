import GameObject from './GameObject';

export default class HockeyGoal extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  update(delta) {}

  render(ctx) {
    const halfWidth = this.width / 2;
    const points = [
      [this.x - halfWidth, this.y],
      [this.x + halfWidth, this.y],
      [this.x + halfWidth, this.y + this.height],
      [this.x - halfWidth, this.y + this.height],
    ];

    ctx.fillStyle = 'dark';
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
  }
}
