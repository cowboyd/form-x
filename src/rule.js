export default class Rule {

  static create(options = {}) {
    return new IdleRule(options);
  }

  constructor(attrs = {}, overrides = {}) {
    Object.assign(this, {
      input: null,
      description: "",
    }, attrs, overrides);
  }

  get isIdle() { return false; }
  get isPending() { return this.isTriggered || this.isRunning; }
  get isTriggered() { return false; }
  get isRunning() { return false; }
  get isFulfilled() { return false; }
  get isRejected() { return false; }
  get isSettled() { return this.isFulfilled || this.isRejected; }

  setInput(input) {
    return new TriggeredRule(this, { input });
  }
}

class IdleRule extends Rule {
  get isIdle() { return true; }
}

class TriggeredRule extends Rule {
  get isTriggered() { return true; }
}
