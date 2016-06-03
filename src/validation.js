export default class Validation {

  static create(options = {}) {
    let {
      isRequired = false,
      rules = []
    } = options;
    return new IdleValidation({rules, isRequired});
  }

  constructor(attrs = {}, overrides = {}) {
    Object.assign(this, {
      isRequired: false
    }, attrs, overrides);
  }

  get isIdle() { return false; }
  get isPending() { return false; }
  get isSatisfied() { return false; }


  setInput(input) {
    return new SatisfiedValidation(this, {input});
  }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
  get isSatisfied() { return !this.isRequired; }
}

class SatisfiedValidation extends Validation {
  get isIdle() { return false; }
  get isSatisfied() { return true; }
}
