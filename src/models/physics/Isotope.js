import ElectricCharge from './ElectricCharge';
import { ELECTRIC_CHARGE_TYPE } from '../../const/charge.const';

class Isotope extends ElectricCharge {
  constructor(x, y) {
    super(
      x,
      y,
      Math.random() < 0.5
        ? ELECTRIC_CHARGE_TYPE.NEGATIVE
        : ELECTRIC_CHARGE_TYPE.POSITIVE
    );
    this.ticks = 5;
    this.startTicking();
  }

  startTicking() {
    const interval = setInterval(() => {
      this.emitParticle();

      if (this.ticks-- === 0) {
        clearInterval(interval);
      }
    }, 5000);
  }

  emitParticle() {}
}
