import Validation  from "../src/validation";
import { expect } from "chai";

/* eslint-disable max-nested-callbacks, func-names, prefer-arrow-callback */
describe("Validation", function() {
  let validation = null;

  describe("when empty", function() {
    beforeEach(function() {
      validation = Validation.create();
    });

    it("is idle", function() {
      expect(validation.isIdle).to.equal(true);
    });
    it("is not pending", function() {
      expect(validation.isPending).to.equal(false);
    });
    it("is not fulfilled", function() {
      expect(validation.isFulfilled).to.equal(false);
    });
    it("is not rejected", function() {
      expect(validation.isRejected).to.equal(false);
    });
    it("has no rules", function() {
      expect(validation.rules).to.deep.equal([]);
      expect(validation.allRules).to.deep.equal([]);
    });
    it("has no pending rules", function() {
      expect(validation.pendingRules).to.deep.equal([]);
    });
    it("has no triggered rules", function() {
      expect(validation.triggeredRules).to.deep.equal([]);
    });
    it("has no running rules", function() {
      expect(validation.runningRules).to.deep.equal([]);
    });
    it("has no rejected rules", function() {
      expect(validation.rejectedRules).to.deep.equal([]);
    });
    it("has no fulfilled rules", function() {
      expect(validation.fulfilledRules).to.deep.equal([]);
    });
    it("has no settled rules", function() {
      expect(validation.settledRules).to.deep.equal([]);
    });
  });
});
