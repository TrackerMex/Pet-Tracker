export class WeightMeasuredInFutureError extends Error {
  constructor() {
    super('measuredAt is too far in the future');
    this.name = 'WeightMeasuredInFutureError';
  }
}
