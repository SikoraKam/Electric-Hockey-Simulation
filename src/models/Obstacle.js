import GameObject from './GameObject';
import GameController from '../controllers/GameController';

export default class Obstacle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  update(delta) {}

  render(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
