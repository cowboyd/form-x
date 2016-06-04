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
      expect(validation.rules).to.deep.equal({});
      expect(validation.all).to.deep.equal([]);
    });
    it("has no pending rules", function() {
      expect(validation.pending).to.deep.equal([]);
    });
    it("has no triggered rules", function() {
      expect(validation.triggered).to.deep.equal([]);
    });
    it("has no running rules", function() {
      expect(validation.running).to.deep.equal([]);
    });
    it("has no rejected rules", function() {
      expect(validation.rejected).to.deep.equal([]);
    });
    it("has no fulfilled rules", function() {
      expect(validation.fulfilled).to.deep.equal([]);
    });
    it("has no settled rules", function() {
      expect(validation.settled).to.deep.equal([]);
    });

    describe("setting the input", function() {
      beforeEach(function() {
        validation = validation.setInput("bob");
      });

      it("is now triggered", function() {
        expect(validation.isPending).to.equal(true);
      });
      it("captures the input", function() {
        expect(validation.input).to.equal("bob");
      });
    });
  });

  describe("when it contains a rule", function() {
    describe("is pending", function() {
      beforeEach(function() {
        validation = new Validation.create({
          rules: {
            longEnough: {}
          }
        }).setInput();
      });

      it("is not idle", function() {
        expect(validation.isIdle).to.equal(false);
      });
      it("is pending", function() {
        expect(validation.isPending).to.equal(true);
      });
      it("is not fulfilled", function() {
        expect(validation.isFulfilled).to.equal(false);
      });
      it("is not rejected", function() {
        expect(validation.isRejected).to.equal(false);
      });

      describe("a rule is run", function() {
        beforeEach(function() {
          validation = validation.run(validation.rules.longEnough);
        });

        it("is now pending", function() {
          expect(validation.isPending).to.equal(true);
        });
        it("has the rule running", function() {
          expect(validation.rules.longEnough.isRunning).to.equal(true);
        });
      });
    });
  });
});
