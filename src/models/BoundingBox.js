export default class BoundingBox {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.move(x, y);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.right = x + this.width;
    this.bottom = y + this.height;
  }

  contains(bbox) {
    return !(
      bbox.x < this.x ||
      bbox.y < this.y ||
      bbox.right > this.right ||
      bbox.bottom > this.bottom
    );
  }

  intersects(bbox) {
    if (this.x >= bbox.right || bbox.x >= this.right) return false;
    if (this.y >= bbox.bottom || bbox.y >= this.bottom) return false;
    return true;
  }

  touches(bbox) {
    if (this.x > bbox.right || bbox.x > this.right) return false;
    if (this.y > bbox.bottom || bbox.y > this.bottom) return false;
    return true;
  }

  distance(bbox) {
    return Math.sqrt(
      Math.pow(this.x - bbox.x, 2) + Math.pow(this.y - bbox.y, 2)
    );
  }
}
