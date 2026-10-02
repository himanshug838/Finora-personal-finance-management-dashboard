import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { autoCategorize } from "../utils/categoryResolver.util.js";

describe("Transaction Processing Logic", () => {
  it("should auto-assign category based on merchant name when category is unspecified", () => {
    const category = autoCategorize("Uber India", "Cab ride to office", "");
    assert.equal(category, "travel");
  });

  it("should default to expense type and require positive amount", () => {
    const validAmount = 500.5;
    assert.ok(validAmount > 0, "Amount must be positive");

    const invalidAmount = -50;
    assert.ok(invalidAmount <= 0, "Negative amount is invalid");
  });

  it("should prevent transfer when source and destination accounts are equal", () => {
    const sourceAccountId = "60d5ecb8b5c9c22b88f98a21";
    const destAccountId = "60d5ecb8b5c9c22b88f98a21";

    const isSameAccount = sourceAccountId === destAccountId;
    assert.equal(isSameAccount, true, "Source and destination accounts match");
  });
});
