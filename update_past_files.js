require('dotenv').config()

const { listPastFiles } = require('./drive/lib/updateDrive')
const { transformPastFilesToUpdates } = require('./lib/transform_past_files')
const { updateSheet } = require('./lib/updateSheet')
const { clearContents } = require('./lib/updateSheet')

;(async () => {
  const past_files = await listPastFiles()
  // console.log(past_files)
  await clearContents('PastFilesSpace')
  const update_past_files = transformPastFilesToUpdates(past_files)
  updateSheet(update_past_files)
} )()