import BoundingBox from '../src/models/BoundingBox';

describe('BoundingBox', () => {
  let bbox;

  beforeEach(() => {
    bbox = new BoundingBox(0, 0, 100, 100);
  });

  it('calculates distance between BoundingBoxes', () => {
    const other = new BoundingBox(200, 200, 100, 100);
    expect(bbox.distance(other)).toBeCloseTo(282.842712);
  });
});
