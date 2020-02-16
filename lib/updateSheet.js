const { google } = require('googleapis')
const moment = require('moment')
const oAuth2Client = require('./googleClient')

oAuth2Client.setCredentials({
  access_token: process.env.SHEETS_ACCESS_TOKEN,
  refresh_token: process.env.SHEETS_REFRESH_TOKEN,
  scope: process.env.SHEETS_SCOPE,
  token_type: process.env.SHEETS_TOKEN_TYPE,
  expiry_date: process.env.SHEETS_EXPIRY_DATE
})

const sheets = google.sheets({
  version: 'v4',
  auth: oAuth2Client
})

exports.updateSheet = async function(updates) {
  try {
    sheets.spreadsheets.values.batchUpdate(
      {
        spreadsheetId: process.env.SHEETS_SHEET_ID,
        resource: {
          valueInputOption: `USER_ENTERED`,
          data: updates.map(p => ({
            range: p.range,
            values: p.values
          }))
        }
      },
      (err, res) => {
        if (err) {
          return console.log("Update failed: ", err);
        }
        console.log(`Success! ${res.data.totalUpdatedCells} cells updated.`);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Promise / await ensures this funtion completes bofore the next one runs.
exports.clearContents = function (namedRange) {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.SHEETS_SHEET_ID,
      range: namedRange
    }, (err, res) => {
      if (err) {
        return console.log('Update failed: ', err)
      }
      console.log(`Success! ${res.data.totalUpdatedCells} cells cleared.`)
      resolve()
    })
  })
}

// Promise / await ensures this funtion completes bofore the next one runs.
exports.rangePosition = function (namedRange, lookup) {
  return new Promise((resolve, reject) => {
     
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEETS_SHEET_ID,
      range: namedRange
    }, (err, res) => {
      if (err) {
        return console.log('Update failed: ', err)
      }
      // console.log(res.data.values)
      // console.log(`${numRows} rows retrieved.`);
      var row = getIndexOf(res.data.values, lookup);
      console.log(row)
      resolve()
    })
  })
}

// find index of data in 2d array
function getIndexOf(arr, k) {
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      // return [i, index];
      return i
    }
  }
}
