export default class Group {
  constructor() {
    this.objects = [];
  }

  add(object) {
    this.objects = [...this.objects, object];
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
}
