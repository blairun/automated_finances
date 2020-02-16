require('dotenv').config({ path: '../../.env' })

const { listFiles } = require('../lib/updateDrive')

// lists files in drive
listFiles()