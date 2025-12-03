import rateLimit from "express-rate-limit";

// Auth endpoints - strict rate limiting
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: "Too many login attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// Public endpoints - moderate rate limiting
export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// Admin endpoints - generous rate limiting
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// API endpoints - balanced rate limiting
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: "Too many API requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});
