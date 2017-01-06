/*global describe, beforeEach */

import Field from "../src/field";
import { expect } from "chai";

describe("Field", function() {
  let field = null;

  describe("when empty", function() {
    beforeEach(function() {
      field = Field.create();
    });

    it("is idle", function() {
      expect(field.isIdle).to.equal(true);
    });

    it("is not validating", function() {
      expect(field.isValidating).to.equal(false);
    });

    it("is not valid", function() {
      expect(field.isValid).to.equal(false);
    });

    it("is not invalid", function() {
      expect(field.isInvalid).to.equal(false);
    });

    it("has an idle validation", function() {
      expect(field.validation.isIdle).to.equal(true);
    });
  });

  describe("when it contains a single rule", function() {
    beforeEach(function() {
      field = new Field.create({
        rules: {
          longEnough: {}
        }
      }).setInput();
    });

    describe("before the field has been validated", function() {
      it("is idle", function() {
        expect(field.isIdle).to.equal(true);
      });

      it("is not validating", function() {
        expect(field.isValidating).to.equal(false);
      });

      it("is not valid", function() {
        expect(field.isValid).to.equal(false);
      });

      it("is not invalid", function() {
        expect(field.isInvalid).to.equal(false);
      });

      it("has an idle validation", function() {
        expect(field.validation.isIdle).to.equal(true);
      });
    });

    describe("the field gets validated", function() {
      beforeEach(function() {
        field = field.validate();
      });

      it("is not idle", function() {
        expect(field.isIdle).to.equal(false);
      });

      it("is validating", function() {
        expect(field.isValidating).to.equal(true);
      });

      it("is not valid", function() {
        expect(field.isValid).to.equal(false);
      });

      it("is not invalid", function() {
        expect(field.isInvalid).to.equal(false);
      });

      it("has a not idle validation", function() {
        expect(field.validation.isIdle).to.equal(false);
      });

      it("has triggered the rule", function() {
        expect(field.rules.longEnough.isTriggered).to.equal(true);
      });

      describe("when the rule is run", function() {
        beforeEach(function() {
          field = field.run(field.rules.longEnough);
        });

        it("is marked as running", function() {
          expect(field.rules.longEnough.isRunning).to.equal(true);
        })

        describe("the rule is fulfilled", function() {
          beforeEach(function() {
            field = field.fulfill(field.rules.longEnough);
          });

          it("is not idle", function() {
            expect(field.isIdle).to.equal(false);
          });

          it("is not validating", function() {
            expect(field.isValidating).to.equal(false);
          });

          it("is valid", function() {
            expect(field.isValid).to.equal(true);
          });

          it("is not invalid", function() {
            expect(field.isInvalid).to.equal(false);
          });
        });

        describe("the rule is rejected", function() {
          beforeEach(function() {
            field = field.reject(field.rules.longEnough);
          });

          it("is not idle", function() {
            expect(field.isIdle).to.equal(false);
          });

          it("is not validating", function() {
            expect(field.isValidating).to.equal(false);
          });

          it("is not valid", function() {
            expect(field.isValid).to.equal(false);
          });

          it("is invalid", function() {
            expect(field.isInvalid).to.equal(true);
          });
        });
      });
    });
  });
});
