import crypto from "crypto";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.model.js";


// ==========================================
// CREATE ACCESS TOKEN
// ==========================================

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};


// ==========================================
// CREATE RAW REFRESH TOKEN
// ==========================================

export const createRawRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};


// ==========================================
// HASH REFRESH TOKEN
// ==========================================

export const hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};


// ==========================================
// STORE REFRESH TOKEN
// ==========================================

export const storeRefreshToken = async ({
  userId,
  rawToken,
  req,
}) => {
  const tokenHash = hashRefreshToken(rawToken);

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 7
  );

  const refreshToken = await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt,
    userAgent: req.headers["user-agent"] || "",
    ipAddress:
      req.ip ||
      req.headers["x-forwarded-for"] ||
      "",
  });

  return refreshToken;
};


// ==========================================
// FIND REFRESH TOKEN
// ==========================================

export const findRefreshToken = async (
  rawToken
) => {
  const tokenHash = hashRefreshToken(
    rawToken
  );

  return RefreshToken.findOne({
    tokenHash,
  });
};


// ==========================================
// REVOKE REFRESH TOKEN
// ==========================================

export const revokeRefreshToken = async (
  refreshToken,
  replacedByTokenHash = null
) => {
  refreshToken.revokedAt = new Date();

  if (replacedByTokenHash) {
    refreshToken.replacedByTokenHash =
      replacedByTokenHash;
  }

  await refreshToken.save();
};


// ==========================================
// REVOKE ALL USER TOKENS
// ==========================================

export const revokeAllUserRefreshTokens =
  async (userId) => {
    await RefreshToken.updateMany(
      {
        user: userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );
  };