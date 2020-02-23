const { google } = require('googleapis')
const oAuth2Client = require('./googleClient')
const moment = require('moment')

oAuth2Client.setCredentials({
  access_token: process.env.DRIVE_ACCESS_TOKEN,
  refresh_token: process.env.DRIVE_REFRESH_TOKEN,
  scope: process.env.DRIVE_SCOPE,
  token_type: process.env.DRIVE_TOKEN_TYPE,
  expiry_date: process.env.DRIVE_EXPIRY_DATE
})

const drive = google.drive({
  version: 'v3',
  auth: oAuth2Client
});

exports.listFiles = function () {
  drive.files.list({
    pageSize: 100,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

// copies fileid in to parent folder
exports.copyFile = function (fileid, parents, name) {
  drive.files.copy({
    fileId: fileid,
    resource: {
      parents: parents,
      name: name
    }
  }, (err, res) => {
    if (err) {
      return console.log('The API returned an error: ' + err);
    }
    console.log(`Success! Copied file: ${res.data.name}`)
  });
}


exports.listPastFiles = function () {
  return new Promise((resolve, reject) => {
    drive.files.list({
      pageSize: 100,
      fields: 'nextPageToken, files(id, name)',
      q: `'${process.env.DRIVE_ARCHIVE_FOLDER_ID}' in parents and trashed = false and name contains 'Finances'`,
      orderBy: "createdTime desc",
      spaces: 'drive'
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      // const files = await Promise.all(res.data.files);
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
        // this is where you save the array that you'll print to spreadsheet
        // console.log(files)
        const files_list = files.map(function (file) {
          
          var a = moment().add(1, 'd');
          var b = moment(file.name.replace("Finances_", ""))
          var c = moment(file.name.replace("Finances_", ""))

          var years = a.diff(b, 'year');
          b.add(years, 'years');

          var months = a.diff(b, 'months');
          b.add(months, 'months');

          var days = a.diff(b, 'days');

          // console.log(years + ' years ' + months + ' months ' + days + ' days');

          var dateDiff = ""
          if (years != 0) {
            dateDiff = dateDiff + years + " yr "
          }
          if (months != 0) {
            dateDiff = dateDiff + months + " mo "
          }
          if (days != 0) {
            dateDiff = dateDiff + days + " d"
          }
          
          return {
            name: moment(c).format("M/D/YY - ") + dateDiff,
            id: file.id
          }
        });
        // console.log(files_list)
        resolve(files_list)
      } else {
        console.log('No files found.');
      }
    });
  });
}