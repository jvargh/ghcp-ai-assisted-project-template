import { canTransition, transition } from "@/lib/survey-lifecycle";
import type { SurveyStatus } from "@/types";

describe("Survey Lifecycle", () => {
  describe("canTransition", () => {
    it("allows draft → open", () => {
      expect(canTransition("draft", "open")).toBe(true);
    });

    it("allows open → closed", () => {
      expect(canTransition("open", "closed")).toBe(true);
    });

    it("disallows draft → closed", () => {
      expect(canTransition("draft", "closed")).toBe(false);
    });

    it("disallows open → draft", () => {
      expect(canTransition("open", "draft")).toBe(false);
    });

    it("disallows closed → open", () => {
      expect(canTransition("closed", "open")).toBe(false);
    });

    it("disallows closed → draft", () => {
      expect(canTransition("closed", "draft")).toBe(false);
    });
  });

  describe("transition", () => {
    it("returns new status on valid transition", () => {
      expect(transition("draft", "open")).toBe("open");
      expect(transition("open", "closed")).toBe("closed");
    });

    it("throws on invalid transition", () => {
      expect(() => transition("draft", "closed")).toThrow(
        'Invalid status transition: cannot move from "draft" to "closed"'
      );
    });

    it("throws when trying to transition from closed", () => {
      const closedTransitions: SurveyStatus[] = ["draft", "open", "closed"];
      for (const target of closedTransitions) {
        expect(() => transition("closed", target)).toThrow();
      }
    });
  });
});
