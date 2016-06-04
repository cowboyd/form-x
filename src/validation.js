import Rule from './rule';

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

  get all() {
    return Object.keys(this.rules).reduce((current, key)=> {
      return current.concat(this.rules[key]);
    }, []);
  }
  get pending() { return this.all.filter((rule)=> rule.isPending); }
  get triggered() { return this.all.filter((rule)=> rule.isTriggered); }
  get running() { return this.all.filter((rule)=> rule.isRunning); }
  get rejected() { return this.all.filter((rule)=> rule.isRejected); }
  get fulfilled() { return this.all.filter((rule)=> rule.isFulfilled); }
  get settled() { return this.all.filter((rule)=> rule.isSettled); }

  setInput(input) {
    return new PendingValidation(this, {
      input: input,
      rules: Object.keys(this.rules).reduce((current, key)=> {
        current[key] = this.rules[key].setInput(input);

        return current;
      }, {})
    });
  }

  run(rule) {
    return new PendingValidation(this, {
      rules: replaceRule(this, rule, r => r.run())
    });
  }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
}

class PendingValidation extends Validation {
  get isPending() { return true; }

  fulfill(rule) {
    let rules = replaceRule(this, rule, r => r.fulfill());
    if (Object.keys(rules).every(key => rules[key].isFulfilled)) {
      return new FulfilledValidation(this, { rules });
    } else {
      return new PendingValidation(this, { rules });
    }
  }

  reject(rule, reason) {
    return new RejectedValidation(this, {
      rules: replaceRule(this, rule, r => r.reject(reason))
    });
  }
}

class FulfilledValidation extends Validation {
  get isFulfilled() { return true; }
}

class RejectedValidation extends Validation {
  get isRejected() { return true; }
}


function replaceRule(validation, rule, mapping) {
  return Object.keys(validation.rules).reduce((current, key)=> {
    let currentRule = validation.rules[key];

    return Object.assign(current, {
      [key]: rule === currentRule ? mapping(rule) : currentRule
    });
  }, {});
}
