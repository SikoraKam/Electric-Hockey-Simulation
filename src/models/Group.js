export default class Group {
  constructor() {
    this.objects = [];
  }

  add(...objects) {
    this.objects = [...this.objects, ...objects];
  }

  remove(object) {
    this.objects = this.objects.filter((object) => object !== object);
  }

  update(delta) {
    this.objects.forEach((object) => object.update(delta));
  }

  render(ctx) {
    this.objects.forEach((object) => object.render(ctx));
  }

  removeAll() {
    this.objects = [];
  }
}
