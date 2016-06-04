import Rule from './rule'

export default class Validation {

  static create(_options = {}) {
    let {
      rules = {}
    } = _options;
    return new IdleValidation({
      rules: Object.keys(rules).reduce(function(current, key) {
        return Object.assign(current, {
          [key]: Rule.create(rules[key])
        });
      },{})
    });
  }

  constructor(attrs = {}, overrides = {}) {
    Object.assign(this, {
      rules: {},
    }, attrs, overrides);
  }

  get isIdle() { return false; }
  get isPending() { return false; }
  get isFulfilled() { return false; }
  get isRejected() { return false; }

  get allRules() {
    return Object.keys(this.rules).reduce((current, key)=> {
      return current.concat(this.rules[key]);
    }, []);
  }
  get pendingRules() { return this.allRules.filter((rule)=> rule.isPending); }
  get triggeredRules() { return this.allRules.filter((rule)=> rule.isTriggered); }
  get runningRules() { return this.allRules.filter((rule)=> rule.isRunning); }
  get rejectedRules() { return this.allRules.filter((rule)=> rule.isRejected); }
  get fulfilledRules() { return this.allRules.filter((rule)=> rule.isFulfilled); }
  get settledRules() { return this.allRules.filter((rule)=> rule.isSettled); }

  setInput(input) {
    return new PendingValidation(this, {
      input: input,
      rules: Object.keys(this.rules).reduce((current, key)=> {
        current[key] = this.rules[key].setInput(input);

        return current;
      }, {}),
    });
  }

  run(rule) {
    return new PendingValidation(this, {
      rules: Object.keys(this.rules).reduce((current, key)=> {
        if(this.rules[key] === rule) {
          current[key] = rule.run();
        }
        else {
          current[key] = this.rules[key];
        }

        return current;
      }, {}),
    });
  }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
}

class PendingValidation extends Validation {
  get isPending() { return true; }
}
