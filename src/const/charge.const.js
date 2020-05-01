import IMAGE_CHARGE_NEGATIVE from '../assets/img/charge_negative.svg';
import IMAGE_CHARGE_POSITIVE from '../assets/img/charge_positive.svg';

export const CHARGE_SIZE = 16;

export const ELECTRIC_CHARGE_TYPE = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
};

export const ELECTRIC_CHARGE_TYPE_TO_IMG = {
  POSITIVE: new Image(),
  NEGATIVE: new Image(),
};

ELECTRIC_CHARGE_TYPE_TO_IMG.POSITIVE.src = IMAGE_CHARGE_POSITIVE;
ELECTRIC_CHARGE_TYPE_TO_IMG.NEGATIVE.src = IMAGE_CHARGE_NEGATIVE;
