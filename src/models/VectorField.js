import Puck from './physics/Puck';
import CoulombForce from './physics/CoulombForce';
import FieldVector from './FieldVector';

export default class VectorField {
  constructor(game) {
    this.game = game;
    this.extendCanvas();
  }

  extendCanvas() {
    if (!CanvasRenderingContext2D || !CanvasRenderingContext2D.prototype)
      return;
    CanvasRenderingContext2D.prototype.arrow = function (
      startX,
      startY,
      endX,
      endY,
      controlPoints
    ) {
      var dx = endX - startX;
      var dy = endY - startY;
      var len = Math.sqrt(dx * dx + dy * dy);
      var sin = dy / len;
      var cos = dx / len;
      var a = [];
      a.push(0, 0);
      for (var i = 0; i < controlPoints.length; i += 2) {
        var x = controlPoints[i];
        var y = controlPoints[i + 1];
        a.push(x < 0 ? len + x : x, y);
      }
      a.push(len, 0);
      for (var i = controlPoints.length; i > 0; i -= 2) {
        var x = controlPoints[i - 2];
        var y = controlPoints[i - 1];
        a.push(x < 0 ? len + x : x, -y);
      }
      a.push(0, 0);
      for (var i = 0; i < a.length; i += 2) {
        var x = a[i] * cos - a[i + 1] * sin + startX;
        var y = a[i] * sin + a[i + 1] * cos + startY;
        if (i === 0) this.moveTo(x, y);
        else this.lineTo(x, y);
      }
    };
  }

  getFieldVectors() {
    return this.makeVectors();
  }

  calculateForceAt(x, y) {
    const puck = new Puck(x, y);
    const netForce = { x: 0, y: 0 };

    this.game.forces
      .slice(0)
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
        const x =
          ((canvas.width - 2 * PADDING_X) / (HORIZONTAL_POINTS - 1)) * col +
          PADDING_X;
        const y =
          ((canvas.height - 2 * PADDING_Y) / (VERTICAL_POINTS - 1)) * row +
          PADDING_Y;

        const force = this.calculateForceAt(x, y);
        vectors.push(new FieldVector(x, y, force.x, force.y));
      }
    }

    return vectors;
  }
}
