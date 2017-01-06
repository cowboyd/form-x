import Validation from './validation';

export default class Field {

  static create(options = {}) {
    let { rules = {}, dependencies = {} } = options;

    // create a Validation out of the rules passed in
    let validation = Validation.create({
      rules,
      dependencies
    });

    return new IdleField({ validation });
  }

  constructor(attrs = {}, overrides = {}) {
    Object.assign(this, {
      validation: {}
    }, attrs, overrides);
  }

  get isIdle() { return false; }
  get isValidating() { return false; }
  get isValid() { return false; }
  get isInvalid() { return false;  }

  get rules() {
    return this.validation.rules;
  }

  setInput(input) {
    return new ValidatingField(this);
  }
}

export class IdleField extends Field {
  get isIdle() { return true; }

  validate() {
    return new ValidatingField(this, {
      validation: this.validation.setInput('')
    });
  }

  setInput(input) {
    return new IdleField(this);
  }
}

export class ValidatingField extends Field {
  get isValidating() { return true; }

  fulfill(rule) {
    let validation = this.validation.fulfill(rule);

    if(validation.isFulfilled) {
      return new ValidField(this, { validation });
    } else {
      return new ValidatingField(this, { validation });
    }
  }

  reject(rule, reason) {
    return new InvalidField(this);
  }

  run(rule) {
    return new ValidatingField(this, {
      validation: this.validation.run(rule)
    })
  }
}

export class ValidField extends Field {
  get isValid() { return true; }
}

export class InvalidField extends Field {
  get isInvalid() { return true; }

  fulfill(rule) {
    return new InvalidField(this);
  }

  reject(rule, reason) {
    return new InvalidField(this);
  }
}
