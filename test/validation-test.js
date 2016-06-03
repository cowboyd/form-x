import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Validation  from '../src/validation';

describe("Validation", function() {
  let state = null;

  beforeEach(function() {
    state = Validation.create({
      required: true,
      rules: {
        longEnough: {
          check: function(value, assert) {
            assert("must be longer than 5 characters", value.length > 0);
          }
        },
        hasSpecialCharacter: {
          check: function(value, assert) {
            assert("must contain at least one special character");
          }
        },
        unique: {
          check: function(value, assert) {
            return
          }
        }
      }
    });
  });
  it("exists", function() {
    expect(state).to.be.instanceOf(Validation);
  });
});
