import GameObject from './GameObject';

export default class HockeyGoal extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.points = this.calculatePoints();
  }

  update(delta) {}

  render(ctx) {
    ctx.fillStyle = 'dark';
    ctx.beginPath();
    ctx.moveTo(this.points[0][0], this.points[0][1]);

    for (let i = 0; i < this.points.length; i++) {
      ctx.lineTo(this.points[i][0], this.points[i][1]);
    }
    ctx.stroke();
  }

  calculatePoints() {
    const halfWidth = this.width / 2;
    return [
      [this.x - halfWidth, this.y],
      [this.x + halfWidth, this.y],
      [this.x + halfWidth, this.y + this.height],
      [this.x - halfWidth, this.y + this.height],
    ];
  }
}
