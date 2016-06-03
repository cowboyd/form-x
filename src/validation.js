export default class Validation {

  static create(_options = {}) {
    return new IdleValidation();
  }

  constructor(attrs = {}, overrides = {}) {
    Object.assign(this, {
      rules: [],
    }, attrs, overrides);
  }

  get isIdle() { return false; }
  get isPending() { return false; }
  get isFulfilled() { return false; }
  get isRejected() { return false; }

  get all_rules() { return this.rules }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
}
