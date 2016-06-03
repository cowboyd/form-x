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

  get allRules() { return this.rules; }
  get pendingRules() { return this.rules.filter((rule)=> rule.isPending); }
  get triggeredRules() { return this.rules.filter((rule)=> rule.isTriggered); }
  get runningRules() { return this.rules.filter((rule)=> rule.isRunning); }
  get rejectedRules() { return this.rules.filter((rule)=> rule.isRejected); }
  get fulfilledRules() { return this.rules.filter((rule)=> rule.isFulfilled); }
  get settledRules() { return this.rules.filter((rule)=> rule.isSettled); }

  setInput(input) {
    return new PendingValidation(this, { input });
  }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
}

class PendingValidation extends Validation {
  get isPending() { return true; }
}
