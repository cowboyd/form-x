export default class Validation {

  static create(_options = {}) {
    return new IdleValidation();
  }

  constructor(attrs = {}, overrides = {}) {
    Object.assign(this, {
    }, attrs, overrides);
  }

  get isIdle() { return false; }
  get isPending() { return false; }
  get isFulfilled() { return false; }
  get isRejected() { return false; }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
}
