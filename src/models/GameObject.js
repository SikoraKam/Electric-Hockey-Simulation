import BoundingBox from './BoundingBox';

export default class GameObject extends BoundingBox {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  update(delta) {
    throw new Error('Method not implemented');
  }

  render(ctx) {
    throw new Error('Method not implemented');
  }
}
