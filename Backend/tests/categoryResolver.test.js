import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { autoCategorize } from "../utils/categoryResolver.util.js";

describe("Auto Categorization Utility", () => {
  it("should categorize food merchants correctly", () => {
    assert.equal(autoCategorize("Swiggy Order", "", ""), "food");
    assert.equal(autoCategorize("Zomato Limited", "Dinner", ""), "food");
    assert.equal(autoCategorize("Starbucks Coffee", "", "other"), "food");
  });

  it("should categorize shopping merchants correctly", () => {
    assert.equal(autoCategorize("Amazon Pay", "Electronics", ""), "shopping");
    assert.equal(autoCategorize("Flipkart Internet", "Clothes", ""), "shopping");
  });

  it("should categorize travel merchants correctly", () => {
    assert.equal(autoCategorize("Uber India", "Cab ride", ""), "travel");
    assert.equal(autoCategorize("Shell Petrol Pump", "Fuel", ""), "travel");
  });

  it("should categorize bills & utilities correctly", () => {
    assert.equal(autoCategorize("Airtel Broadband", "Monthly Bill", ""), "bills");
    assert.equal(autoCategorize("Electricity Board", "Power bill", ""), "bills");
  });

  it("should categorize entertainment correctly", () => {
    assert.equal(autoCategorize("Netflix Subscription", "Monthly", ""), "entertainment");
    assert.equal(autoCategorize("BookMyShow", "Movie tickets", ""), "entertainment");
  });

  it("should preserve explicitly selected category", () => {
    assert.equal(autoCategorize("Amazon", "Presents", "education"), "education");
    assert.equal(autoCategorize("Starbucks", "Coffee", "health"), "health");
  });

  it("should fallback to 'other' if no keyword matches", () => {
    assert.equal(autoCategorize("Unknown Vendor 123", "Miscellaneous", ""), "other");
  });
});
