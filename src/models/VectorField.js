import Puck from './physics/Puck';
import CoulombForce from './physics/CoulombForce';
import FieldVector from './FieldVector';

export default class VectorField {
  constructor(game) {
    this.game = game;
    this.forces = game.forces.slice(0);
  }

  getFieldVectors() {
    return this.makeVectors();
  }

  calculateForceAt(x, y) {
    const puck = new Puck(x, y);
    const netForce = { x: 0, y: 0 };

    this.forces
      .map((force) => new CoulombForce(force.charge1, puck))
      .forEach((force) => {
        force.calculate();

        netForce.x += force.x;
        netForce.y += force.y;
      });

    return netForce;
  }

  makeVectors() {
    const VERTICAL_POINTS = 6;
    const HORIZONTAL_POINTS = 12;
    const PADDING_X = 80;
    const PADDING_Y = 60;
    const { canvas } = this.game;
    const vectors = [];

    for (let row = 0; row < VERTICAL_POINTS; row++) {
      for (let col = 0; col < HORIZONTAL_POINTS; col++) {
        const x = (canvas.width - 2 * PADDING_X) / (HORIZONTAL_POINTS - 1) * col + PADDING_X;
        const y = (canvas.height - 2 * PADDING_Y) / (VERTICAL_POINTS - 1) * row + PADDING_Y;
        console.log(x, y)

        const force = this.calculateForceAt(x, y);

        vectors.push(new FieldVector(x, y, force.x, force.y))
      }
    }

    return vectors;
  }
}