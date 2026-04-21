import { validateCredentials, isValidSessionToken } from "@/lib/auth";

describe("auth", () => {
  describe("validateCredentials", () => {
    it("accepts correct credentials", () => {
      expect(validateCredentials("admin", "admin123")).toBe(true);
    });

    it("rejects wrong password", () => {
      expect(validateCredentials("admin", "wrong")).toBe(false);
    });

    it("rejects wrong username", () => {
      expect(validateCredentials("user", "admin123")).toBe(false);
    });

    it("rejects empty credentials", () => {
      expect(validateCredentials("", "")).toBe(false);
    });
  });

  describe("isValidSessionToken", () => {
    it("validates correct token", () => {
      expect(isValidSessionToken("coordinator-session-token")).toBe(true);
    });

    it("rejects invalid token", () => {
      expect(isValidSessionToken("wrong-token")).toBe(false);
    });

    it("rejects undefined", () => {
      expect(isValidSessionToken(undefined)).toBe(false);
    });
  });
});
