import GameObject from './GameObject';
import GameController from '../controllers/GameController';

export default class Obstacle extends GameObject {
  constructor(x, y, width, height, transparent = false) {
    super(x, y, width, height);
    this.transparennt = transparent;
  }

  update(delta) {}

  render(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.transparennt === false) {
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
