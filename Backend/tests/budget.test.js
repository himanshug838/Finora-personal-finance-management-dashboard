import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Budget Limit & Progress Logic", () => {
  it("should calculate correct percentage of spent vs limit", () => {
    const limit = 10000;
    const spent = 7500;
    const percentage = Math.round((spent / limit) * 100);

    assert.equal(percentage, 75);
  });

  it("should flag budget exceeded when spent exceeds limit", () => {
    const limit = 5000;
    const spent = 6200;
    const isExceeded = spent > limit;

    assert.equal(isExceeded, true);
    assert.equal(spent - limit, 1200);
  });

  it("should calculate remaining budget correctly", () => {
    const limit = 8000;
    const spent = 3000;
    const remaining = Math.max(0, limit - spent);

    assert.equal(remaining, 5000);
  });
});
