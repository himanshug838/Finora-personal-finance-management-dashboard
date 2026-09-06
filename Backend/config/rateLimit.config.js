import rateLimit from "express-rate-limit";


// =====================================================
// LOGIN RATE LIMITER
// =====================================================

export const loginLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,

      message:
        "Too many login attempts. Please try again later.",
    },
  });


// =====================================================
// REFRESH TOKEN RATE LIMITER
// =====================================================

export const refreshLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 30,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,

      message:
        "Too many token refresh attempts. Please try again later.",
    },
  });