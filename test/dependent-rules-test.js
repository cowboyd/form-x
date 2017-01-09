/*global describe, beforeEach */

import Validation  from "../src/validation";
import { expect } from "chai";

/* eslint-disable max-nested-callbacks, func-names, prefer-arrow-callback */
describe("Validation with Dependendent Rules", function() {
  let validation = null;

  beforeEach(function() {
    validation = Validation.create();

    validation = Validation.create({
      rules: {
        goodEnough: {},
        smartEnough: {},
        goshDarnItPeopleLikeMe: {}
      },
      dependencies: {
        goshDarnItPeopleLikeMe: ['goodEnough', 'smartEnough']
      }
    }).setInput('stuart');
  });

  it("triggers the first two rules but not the third", function() {
    expect(validation.rules.goodEnough.isTriggered).to.equal(true);
    expect(validation.rules.smartEnough.isTriggered).to.equal(true);
    expect(validation.rules.goshDarnItPeopleLikeMe.isTriggered).to.equal(false);
  });

  describe("when the first two rules fulfill", function() {
    beforeEach(function() {
      validation = validation
        .run(validation.rules.goodEnough)
        .run(validation.rules.smartEnough);

      validation = validation
        .fulfill(validation.rules.goodEnough)
        .fulfill(validation.rules.smartEnough);
    })

    it("sets the third rule to triggered", function() {
      expect(validation.rules.goshDarnItPeopleLikeMe.isTriggered).to.equal(true);
    });

    it("sets the input of the third rule", function() {
      expect(validation.rules.goshDarnItPeopleLikeMe.input).to.equal("stuart");
    });

    describe("setting the input while third rule is pending", function() {
      beforeEach(function() {
        validation = validation.setInput('smalley');
      });

      it("sets the first two inputs back to triggered", function() {
        expect(validation.rules.goodEnough.isTriggered).to.equal(true);
        expect(validation.rules.smartEnough.isTriggered).to.equal(true);
      });

      it("sets the third input to idle", function() {
        expect(validation.rules.goshDarnItPeopleLikeMe.isIdle).to.equal(true);
      });
    })
  });
});
