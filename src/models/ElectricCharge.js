import GameObject from './GameObject';
import {
  CHARGE_SIZE,
  ELECTRIC_CHARGE_TYPE_TO_IMG,
} from '../const/charge.const';

export default class ElectricCharge extends GameObject {
  constructor(x, y, type) {
    super(x, y, CHARGE_SIZE, CHARGE_SIZE);
    this.type = type;
    this.img = ELECTRIC_CHARGE_TYPE_TO_IMG[type];
  }

  update(delta) {}

  render(ctx) {
    ctx.drawImage(this.img, this.x, this.y, CHARGE_SIZE, CHARGE_SIZE);
  }
}
