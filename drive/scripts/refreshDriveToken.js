require('dotenv').config({ path: '../../.env' })

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const oAuth2Client = require('../lib/googleClient')
const saveEnv = require('./saveEnv')

//https://github.com/googleapis/google-api-nodejs-client
// oAuth2Client.on('tokens', (process) => {
//   console.log("hi:");
//   if (process.env.DRIVE_REFRESH_TOKEN) {
//     // store the refresh_token in my database!
//     console.log(tokens.refresh_token);
//   }
//   console.log(tokens.access_token);
// });

//https://developers.google.com/oauthplayground/
var request = require("request");

var options = {
  method: 'POST',
  url: 'https://oauth2.googleapis.com/token',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  form: {
    grant_type: 'refresh_token',
    client_id: process.env.DRIVE_CLIENT_ID,
    refresh_token: process.env.DRIVE_REFRESH_TOKEN,
    client_secret: process.env.DRIVE_CLIENT_SECRET,
  }
};

request(options, function (error, response, body) {
  
  return new Promise((resolve, reject) => {
  if (error) throw new Error(error);

  console.log(JSON.parse(body))

  let vars = {}
  const tokenEnvVars = Object.keys(JSON.parse(body)).forEach(key => {
    vars[`DRIVE_${key.toUpperCase()}`] = JSON.parse(body)[key]
    // console.log(key)
  })

  saveEnv(vars)
  console.log(`Token stored in .env.`)
  resolve()
  });
});