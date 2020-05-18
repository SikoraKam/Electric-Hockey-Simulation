import Puck from './physics/Puck';
import CoulombForce from './physics/CoulombForce';
import FieldVector from './FieldVector';
import { median } from 'mathjs';

export const VECTOR_FIELD_ROWS = 6;
const VECTOR_FIELD_COLS = 12;
const VECTOR_FIELD_PADDING_X = 80;
const VECTOR_FIELD_PADDING_Y = 60;

export default class VectorField {
  constructor(game) {
    this.game = game;
    this.vectors = [];
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
    const { canvas } = this.game;
    const vectors = [];

    for (let row = 0; row < VECTOR_FIELD_ROWS; row++) {
      for (let col = 0; col < VECTOR_FIELD_COLS; col++) {
        const x =
          ((canvas.width - 2 * VECTOR_FIELD_PADDING_X) /
            (VECTOR_FIELD_COLS - 1)) *
            col +
          VECTOR_FIELD_PADDING_X;
        const y =
          ((canvas.height - 2 * VECTOR_FIELD_PADDING_Y) /
            (VECTOR_FIELD_ROWS - 1)) *
            row +
          VECTOR_FIELD_PADDING_Y;

        const force = this.calculateForceAt(x, y);
        const vec = new FieldVector(x, y, force.x, force.y);

        vectors.push(vec);
      }
    }

    this.shapeVectors(vectors);

    return vectors;
  }

  shapeVectors(vectors) {
    const medianForce = median(vectors.map((vector) => vector.force));
    vectors.forEach((vector) => {
      vector.calculateLength(medianForce);
      vector.calculateColor(medianForce);
    });
  }
}
