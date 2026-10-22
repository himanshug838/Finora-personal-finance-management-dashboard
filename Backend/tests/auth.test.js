import { describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

describe("Authentication & JWT Logic", () => {
  const secretKey = "test_jwt_secret_key_123";

  it("should correctly hash and compare passwords with bcrypt", async () => {
    const rawPassword = "SecurePassword123!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    assert.notEqual(rawPassword, hashedPassword);
    const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
    assert.equal(isMatch, true);

    const isWrongMatch = await bcrypt.compare("WrongPassword", hashedPassword);
    assert.equal(isWrongMatch, false);
  });

  it("should generate and verify valid JWT tokens", () => {
    const payload = { id: "60d5ecb8b5c9c22b88f98a21", email: "test@example.com" };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    assert.ok(token);

    const decoded = jwt.verify(token, secretKey);
    assert.equal(decoded.id, payload.id);
    assert.equal(decoded.email, payload.email);
  });

  it("should fail verification for invalid token signatures", () => {
    const payload = { id: "60d5ecb8b5c9c22b88f98a21" };
    const token = jwt.sign(payload, secretKey);

    assert.throws(() => {
      jwt.verify(token, "wrong_secret_key");
    });
  });
});
