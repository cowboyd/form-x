import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Validation  from '../src/validation';

describe("Validation", function() {
  let state;

  describe("when empty", function() {
    beforeEach(function() {
      state = Validation.create();
    });
    it("is idle", function() {
      expect(state.isIdle).to.equal(true);
    });
    it("is not required by default", function() {
      expect(state.isRequired).to.equal(false);
    });
    it("is satisfied becauce it is not required", function() {
      expect(state.isSatisfied).to.equal(true);
    });
    it("has rules", function() {
      expect(state.rules).to.deep.equal([]);
    });
    describe("setting any input whatsoever", function() {
      beforeEach(function() {
        state = state.setInput('wut?');
      });
      it("is not idle", function() {
        expect(state.isIdle).to.equal(false);
      });
      it("is not pending", function() {
        expect(state.isPending).to.equal(false);
      });
      it("is satisfied", function() {
        expect(state.isSatisfied).to.equal(true);
      });
    });
  });

  describe("without rules, but required", function() {
    beforeEach(function() {
      state = Validation.create({isRequired: true});
    });
    it("is not satisfied", function() {
      expect(state.isSatisfied).to.equal(false);
    });
    describe("setting any input what", function() {
      beforeEach(function() {
        state = state.setInput('hallo');
      });
      it("is satisfied", function() {
        expect(state.isSatisfied).to.equal(true);
      });
    });
  });

  describe("with some password rules", function() {
    let server, resolve, reject;

    beforeEach(function() {
      server = new Promise(function() {
        [resolve, reject] = arguments;
      });
      state = Validation.create({
        rules: {
          longEnough: {
            check: function(value, assert) {
              assert("must be longer than 5 characters", value.length > 0);
            }
          },
          hasSpecialCharacter: {
            check: function(value, assert) {
              assert("must contain at least one special character", );
            }
          },
          unique: {
            check: function(value, assert) {
              return new Promise(function(resolve, reject) {

              });
            },
            dependsOn: ['longEnough', 'hasSpecialCharacter']
          }
        }
      });
    });

    it("isIdle", function() {
      expect(state.isIdle).to.equal(true);
    });
    it("is not required by default", function() {
      expect(state.isRequired).to.equal(false);
    });
    it("is satisfied because it is not required", function() {
      expect(state.isSatisfied).to.equal(true);
    });
    describe("setting some valid input", function() {
      beforeEach(function() {
        state = state.setInput('$bob$');
      });
    });
  });
});
