const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const db = require("../config/db");
const {
  findUserByEmail,
  createUser,
  updateUserFields,
} = require("../queries/userQueries");

/**
 * @route   POST /v1/auth/
 * @desc    Authenticate user with Firebase ID token and retrieve/update user profile
 * @access  Public
 * @param   {string} idToken - Firebase authentication ID token
 * @returns {Object} User profile and authentication status
 */
router.post("/", async (req, res) => {
  try {
    const idToken = req.body?.idToken;

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required" });
    }

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, uid, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ error: "Invalid Firebase Token" });
    }

    // Check if user exists in PostgreSQL
    let user = await findUserByEmail(email);

    // If user does not exist, create the user
    if (!user) {
      // Parse name
      let firstName = "";
      let lastName = "";
      if (name) {
        const nameParts = name.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }
      user = await createUser({
        email,
        uuid: uid,
        firstName,
        lastName,
        imageUrl: picture || "https://via.placeholder.com/150",
      });
    } else {
      // Update missing fields in the database
      let firstName = user.firstname || "";
      let lastName = user.lastname || "";
      let imageUrl = user.imageurl || "https://via.placeholder.com/150";

      if (name && (!user.firstname || !user.lastname)) {
        const nameParts = name.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }

      if (!user.uuid) {
        user.uuid = uid;
      }

      if (!user.imageurl && picture) {
        imageUrl = picture;
      }

      // Save updated user details
      await updateUserFields(email, {
        firstname: firstName,
        lastname: lastName,
        uuid: uid,
        imageurl: imageUrl,
      });
      // Refresh user
      user = await findUserByEmail(email);
    }

    // Return success response
    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        imageUrl: user.imageurl || "https://via.placeholder.com/150",
        uuid: user.uuid,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
