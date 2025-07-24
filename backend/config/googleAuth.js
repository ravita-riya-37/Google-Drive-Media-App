const { google } = require("googleapis");
const path = require("path");

// Load service account key
const KEYFILEPATH = path.join(__dirname, "service-account-key.json"); // make sure the key file is in this folder
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

// Create auth client
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

module.exports = auth;
