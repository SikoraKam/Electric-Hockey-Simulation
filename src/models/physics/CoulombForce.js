import {
  CHARGE_MIN_DISTANCE,
  COULOMB_FORCE_FACTOR,
} from '../../const/physics.const';

export default class CoulombForce {
  constructor(charge1, charge2) {
    this.charge1 = charge1;
    this.charge2 = charge2;
    this.calculate();
  }

  calculate() {
    this.displacement = {
      x: this.charge2.x - this.charge1.x,
      y: this.charge2.y - this.charge1.y,
    };

    this.r = Math.max(this.charge1.distance(this.charge2), CHARGE_MIN_DISTANCE);
    this.rCube = Math.pow(this.r, 3);

    this.x = this.calculateComposite(this.displacement.x);
    this.y = this.calculateComposite(this.displacement.y);
  }

  calculateComposite(displacement) {
    return (
      (COULOMB_FORCE_FACTOR *
        this.charge1.getSign() *
        this.charge2.getSign() *
        displacement) /
      this.rCube
    );
  }
}
