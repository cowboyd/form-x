import Rule from "../src/rule";
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

  });
});
