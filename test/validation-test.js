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
  });
});
