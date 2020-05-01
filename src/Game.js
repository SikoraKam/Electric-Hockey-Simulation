import MainLoop from 'mainloop.js';
import Group from './models/Group';
import Puck from './models/Puck';
import { K_CONST } from './const/game.const';

export default class Game {
  constructor() {
    this.setup();
    this.bindLoopFunctions();

    this.groups = {
      puck: new Group(),
      charges: new Group(),
    };

    this.puck = new Puck(100, 100);
    this.groups.puck.add(this.puck);

    this.chargeMass = 25 * 1000;
  }

  setup() {
    this.loop = MainLoop;
    this.canvas = document.querySelector('.js-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.setCanvasAspectRatio();
    window.addEventListener('resize', this.setCanvasAspectRatio.bind(this));
  }

  bindLoopFunctions() {
    MainLoop.setUpdate(this.update.bind(this));
    MainLoop.setDraw(this.render.bind(this));
  }

  setCanvasAspectRatio() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(delta) {
    this.puck.acceleration = this.calculateFieldForce();
    Object.values(this.groups).forEach((group) => group.update(delta));
  }

  render() {
    this.clear();
    Object.values(this.groups).forEach((group) => group.render(this.ctx));
  }

  calculateFieldForce() {
    const puck = this.puck;
    const chargeMass = this.chargeMass;
    const force = { x: 0, y: 0 };

    this.groups.charges.objects.forEach((charge) => {
      const r = charge.distance(puck);

      const sin = (charge.x - puck.x) / r;
      const cos = (charge.y - puck.y) / r;
      const repelling = charge.type === puck.type ? -1 : 1;

      force.x += repelling * (sin / (Math.pow(r, 2) * chargeMass)) * K_CONST;
      force.y += repelling * (cos / (Math.pow(r, 2) * chargeMass)) * K_CONST;
    });

    return force;
  }
}
