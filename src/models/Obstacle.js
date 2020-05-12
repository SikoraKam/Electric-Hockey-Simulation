import GameObject from './GameObject';
import GameController from '../controllers/GameController';

export default class Obstacle extends GameObject {
  constructor(x, y, width, height, transparent = false) {
    super(x, y, width, height);
    this.transparent = transparent;
  }

  update(delta) {}

  render(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.transparent === false) {
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
