const { google } = require('googleapis')

module.exports = new google.auth.OAuth2(
  process.env.DRIVE_CLIENT_ID,
  process.env.DRIVE_CLIENT_SECRET,
  process.env.DRIVE_REDIRECT_URI
)
