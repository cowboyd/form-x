import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import Rule from '../src/rule';

describe("Rule", function() {
  let state;
  describe("when empty", function() {
    beforeEach(function() {
      state = Rule.create();
    });
    it("accepts a description", function() {
      expect(Rule.create({description: 'awesome'}).description).to.equal('awesome');
    });
    it("has an empty description", function() {
      expect(state.description).to.equal("");
    });
    it("is idle", function() {
      expect(state.isIdle).to.equal(true);
    });
    it("is not pending", function() {
      expect(state.isPending).to.equal(false);
    });
    it("is not triggred", function() {
      expect(state.isTriggered).to.equal(false);
    });
    it("is not rejected", function() {
      expect(state.isRejected).to.equal(false);
    });
    it("is not fulfilled", function() {
      expect(state.isFulfilled).to.equal(false);
    });
    it("is not settled", function() {
      expect(state.isSettled).to.equal(false);
    });

    describe("setting the input", function() {
      beforeEach(function() {
        state = state.setInput('bob');
      });
      it("is now triggered", function() {
        expect(state.isTriggered).to.equal(true);
      });
      it("captures the input", function() {
        expect(state.input).to.equal('bob');
      });
    });

  });
});
