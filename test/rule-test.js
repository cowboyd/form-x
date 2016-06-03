import Rule, { RunningRule, TriggeredRule } from "../src/rule";
import { expect } from "chai";

/* eslint-disable max-nested-callbacks */
describe("Rule", ()=> {
  let rule = null;

  describe("when empty", ()=> {
    beforeEach(()=> {
      rule = Rule.create();
    });
    it("accepts a description", ()=> {
      expect(Rule.create({ description: "awesome" }).description).to.equal("awesome");
    });
    it("has an empty description", ()=> {
      expect(rule.description).to.equal("");
    });
    it("is idle", ()=> {
      expect(rule.isIdle).to.equal(true);
    });
    it("is not pending", ()=> {
      expect(rule.isPending).to.equal(false);
    });
    it("is not triggred", ()=> {
      expect(rule.isTriggered).to.equal(false);
    });
    it("is not running", ()=> {
      expect(rule.isRunning).to.equal(false);
    });
    it("is not rejected", ()=> {
      expect(rule.isRejected).to.equal(false);
    });
    it("is not fulfilled", ()=> {
      expect(rule.isFulfilled).to.equal(false);
    });
    it("is not settled", ()=> {
      expect(rule.isSettled).to.equal(false);
    });

    describe("setting the input", ()=> {
      beforeEach(()=> {
        rule = rule.setInput("bob");
      });
      it("is now triggered", ()=> {
        expect(rule.isTriggered).to.equal(true);
      });
      it("captures the input", ()=> {
        expect(rule.input).to.equal("bob");
      });
    });
  });

  describe("when triggered", ()=> {
    beforeEach(()=> {
      rule = new TriggeredRule();
    });

    it("is not idle", ()=> {
      expect(rule.isIdle).to.equal(false);
    });
    it("is pending", ()=> {
      expect(rule.isPending).to.equal(true);
    });
    it("is triggred", ()=> {
      expect(rule.isTriggered).to.equal(true);
    });
    it("is not running", ()=> {
      expect(rule.isRunning).to.equal(false);
    });
    it("is not rejected", ()=> {
      expect(rule.isRejected).to.equal(false);
    });
    it("is not fulfilled", ()=> {
      expect(rule.isFulfilled).to.equal(false);
    });
    it("is not settled", ()=> {
      expect(rule.isSettled).to.equal(false);
    });

    describe("when run", ()=> {
      beforeEach(()=> {
        rule = rule.run();
      });

      it("is now running", ()=> {
        expect(rule.isRunning).to.equal(true);
      });
    });
  });

  describe("when running", ()=> {
    beforeEach(()=> {
      rule = new RunningRule();
    });

    it("is not idle", ()=> {
      expect(rule.isIdle).to.equal(false);
    });
    it("is pending", ()=> {
      expect(rule.isPending).to.equal(true);
    });
    it("is triggred", ()=> {
      expect(rule.isTriggered).to.equal(false);
    });
    it("is running", ()=> {
      expect(rule.isRunning).to.equal(true);
    });
    it("is not rejected", ()=> {
      expect(rule.isRejected).to.equal(false);
    });
    it("is not fulfilled", ()=> {
      expect(rule.isFulfilled).to.equal(false);
    });
    it("is not settled", ()=> {
      expect(rule.isSettled).to.equal(false);
    });

    describe("when fulfilled", ()=> {
      beforeEach(()=> {
        rule = rule.fulfill();
      });

      it("is now fulfilled", ()=> {
        expect(rule.isFulfilled).to.equal(true);
      });

      it("is now settled", ()=> {
        expect(rule.isSettled).to.equal(true);
      });
    });

    describe("when rejected", ()=> {
      beforeEach(()=> {
        rule = rule.reject();
      });

      it("is now rejected", ()=> {
        expect(rule.isRejected).to.equal(true);
      });

      it("is now settled", ()=> {
        expect(rule.isSettled).to.equal(true);
      });
    });

    describe("when rejected with a reason", ()=> {
      beforeEach(()=> {
        rule = rule.reject("you broke stuff!");
      });

      it("is now rejected", ()=> {
        expect(rule.reason).to.equal("you broke stuff!");
      });
    });
  });
});
