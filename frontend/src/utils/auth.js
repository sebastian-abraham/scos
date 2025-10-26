import { getAuth } from "firebase/auth";

/**
 * Utility function to get the Firebase ID token for authenticated users.
 * @returns {Promise<string|null>} The Firebase ID Token or null if not authenticated.
 */
export const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

/**
 * Utility function to get Authorization headers for authenticated requests.
 * @returns {Promise<{ Authorization: string }>} Headers object with Bearer token, or empty if not authenticated.
 */
export const getAuthHeaders = async () => {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
