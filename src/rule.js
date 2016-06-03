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

export class IdleRule extends Rule {
  get isIdle() { return true; }
}

export class TriggeredRule extends Rule {
  get isTriggered() { return true; }

  run() {
    return new RunningRule(this);
  }
}

export class RunningRule extends Rule {
  get isRunning() { return true; }

  fulfill() {
    return new FulfilledRule(this);
  }
}

export class FulfilledRule extends Rule {
  get isFulfilled() { return true; }
}
