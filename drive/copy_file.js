require('dotenv').config({ path: '../.env' })

const { copyFile } = require('./lib/updateDrive')

const moment = require('moment')
// const date = moment().format('YYYY/MM/DD');
const date = moment().format('MM/DD/YYYY');

;(async () => {
  // copies fileid into parent folder
  copyFile(
    process.env.SHEETS_SHEET_ID,
    [process.env.DRIVE_ARCHIVE_FOLDER_ID],
    'Finances_' + date
  )
})()