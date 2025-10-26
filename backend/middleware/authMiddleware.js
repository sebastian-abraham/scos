const admin = require("../config/firebase");
const { findUserByUuid } = require("../queries/userQueries");

/**
 * Middleware factory to authenticate Firebase users via ID token and verify admin access/role(s)
 * @param {string[]} userRoles - Array of allowed user roles (e.g., ['Admin', 'SuperAdmin'])
 */

const authenticateUser = (userRoles = []) => async (req, res, next) => {
  try {
    // Allow skipping authentication in dev mode
    if (req.headers.authorization === 'dev') {
      req.user = {
        id: 1,
        uuid: 'dev-user',
        email: 'dev@example.com',
        role: 'Dev',
        name: 'Developer',
      };
      return next();
    }

    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    // Check if the user exists in PostgreSQL (via query abstraction)
    const user = await findUserByUuid(decodedToken.uid);

    if (!user) {
      return res.status(403).json({ error: "Access Denied: User not found or not allowed" });
    }

    // Check if user's role is in the allowed roles array (if provided)
    if (userRoles.length > 0 && !userRoles.includes(user.role)) {
      return res.status(403).json({ error: "Access Denied: Insufficient permissions" });
    }

    // Attach user info to request
    req.user = user;
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ error: "Unauthorized: Token verification failed" });
  }
};

module.exports = authenticateUser;
