import Rule, { FulfilledRule, RunningRule, TriggeredRule } from "../src/rule";
import { expect } from "chai";

/* eslint-disable max-nested-callbacks */
describe("Rule", ()=> {
  let state = null;

  describe("when empty", ()=> {
    beforeEach(()=> {
      state = Rule.create();
    });
    it("accepts a description", ()=> {
      expect(Rule.create({ description: "awesome" }).description).to.equal("awesome");
    });
    it("has an empty description", ()=> {
      expect(state.description).to.equal("");
    });
    it("is idle", ()=> {
      expect(state.isIdle).to.equal(true);
    });
    it("is not pending", ()=> {
      expect(state.isPending).to.equal(false);
    });
    it("is not triggred", ()=> {
      expect(state.isTriggered).to.equal(false);
    });
    it("is not running", ()=> {
      expect(state.isRunning).to.equal(false);
    });
    it("is not rejected", ()=> {
      expect(state.isRejected).to.equal(false);
    });
    it("is not fulfilled", ()=> {
      expect(state.isFulfilled).to.equal(false);
    });
    it("is not settled", ()=> {
      expect(state.isSettled).to.equal(false);
    });

    describe("setting the input", ()=> {
      beforeEach(()=> {
        state = state.setInput("bob");
      });
      it("is now triggered", ()=> {
        expect(state.isTriggered).to.equal(true);
      });
      it("captures the input", ()=> {
        expect(state.input).to.equal("bob");
      });
    });
  });

  describe("when triggered", ()=> {
    beforeEach(()=> {
      state = new TriggeredRule();
    });

    it("is not idle", ()=> {
      expect(state.isIdle).to.equal(false);
    });
    it("is pending", ()=> {
      expect(state.isPending).to.equal(true);
    });
    it("is triggred", ()=> {
      expect(state.isTriggered).to.equal(true);
    });
    it("is not running", ()=> {
      expect(state.isRunning).to.equal(false);
    });
    it("is not rejected", ()=> {
      expect(state.isRejected).to.equal(false);
    });
    it("is not fulfilled", ()=> {
      expect(state.isFulfilled).to.equal(false);
    });
    it("is not settled", ()=> {
      expect(state.isSettled).to.equal(false);
    });

    describe("when run", ()=> {
      beforeEach(()=> {
        state = state.run();
      });

      it("is now running", ()=> {
        expect(state.isRunning).to.equal(true);
      });
    });
  });

  describe("when running", ()=> {
    beforeEach(()=> {
      state = new RunningRule();
    });

    it("is not idle", ()=> {
      expect(state.isIdle).to.equal(false);
    });
    it("is pending", ()=> {
      expect(state.isPending).to.equal(true);
    });
    it("is triggred", ()=> {
      expect(state.isTriggered).to.equal(false);
    });
    it("is running", ()=> {
      expect(state.isRunning).to.equal(true);
    });
    it("is not rejected", ()=> {
      expect(state.isRejected).to.equal(false);
    });
    it("is not fulfilled", ()=> {
      expect(state.isFulfilled).to.equal(false);
    });
    it("is not settled", ()=> {
      expect(state.isSettled).to.equal(false);
    });

    describe("when fulfilled", ()=> {
      beforeEach(()=> {
        state = state.fulfill();
      });

      it("is now fulfilled", ()=> {
        expect(state.isFulfilled).to.equal(true);
      });
    });
  });
});
