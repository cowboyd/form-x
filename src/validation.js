import Rule from './rule';
import assign from './assign';

export default class Validation {

  static create(options = {}) {
    let { rules = {}, dependencies = {} } = options;

    return new IdleValidation({
      rules: Object.keys(rules).reduce(function(current, key) {
        return assign(current, {
          [key]: Rule.create(rules[key])
        });
      },{}),
      dependencies
    });
  }

  constructor(previous = {}, attrs = {}) {
    assign(this, {
      rules: {}
    }, previous, attrs);
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
        if(this.dependencies[key] && this.dependencies[key].length > 0) {
          return assign(current, {
            [key]: this.rules[key].reset()
          });
        } else {
          return assign(current, {
            [key]: this.rules[key].setInput(input)
          });
        }
      }, {})
    });
  }

  run(rule) {
    return new PendingValidation(this, {
      rules: replaceRule(this, rule, rule.run())
    });
  }
}

class IdleValidation extends Validation {
  get isIdle() { return true; }
}


let Rejectable = (superclass) => class extends superclass {
  reject(rule, reason) {
    return new RejectedValidation(this, {
      rules: replaceRule(this, rule, rule.reject(reason))
    });
  }
};

class PendingValidation extends Rejectable(Validation) {
  get isPending() { return true; }

  fulfill(rule) {
    let rules = replaceRule(this, rule, rule.fulfill());

    if (Object.keys(rules).every(key => rules[key].isFulfilled)) {
      return new FulfilledValidation(this, { rules });
    } else {
      return new PendingValidation(this, {
        rules: Object.keys(rules).reduce((newRules, key)=> {
          if(!rules[key].isIdle) {
            newRules[key] = rules[key];
          } else {
            let dependencies = this.dependencies[key] || [];
            if(dependencies.every(dependencyKey => rules[dependencyKey].isFulfilled)) {
              newRules[key] = rules[key].setInput(this.input);
            } else {
              newRules[key] = rules[key];
            }
          }

          return newRules;
        }, {})
       });
    }
  }
}

class FulfilledValidation extends Validation {
  get isFulfilled() { return true; }
}

class RejectedValidation extends Rejectable(Validation) {
  get isRejected() { return true; }

  fulfill(rule) {
    return new RejectedValidation(this, {
      rules: replaceRule(this, rule, rule.fulfill())
    });
  }
}


function replaceRule(validation, rule, newRule) {
  return Object.keys(validation.rules).reduce((current, key)=> {
    let currentRule = validation.rules[key];

    return assign(current, {
      [key]: rule === currentRule ? newRule : currentRule
    });
  }, {});
}
