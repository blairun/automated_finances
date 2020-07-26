require('dotenv').config({ path: '../../.env' })

const { listFiles, retrieveAllFiles } = require('../lib/updateDrive')

// lists files in drive
listFiles()

// retrieveAllFiles()