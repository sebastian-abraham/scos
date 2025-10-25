// Example: firebase.js
const admin = require('firebase-admin');

// Check if we are running on Render, if so, use the secret file path
// Otherwise, use the local path
const serviceAccountPath = process.env.RENDER 
  ? '/etc/secrets/serviceAccountKey.json' 
  : './serviceAccountKey.json';

const serviceAccount = require(serviceAccountPath); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;