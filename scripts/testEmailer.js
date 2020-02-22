require('dotenv').config({ path: '../.env' })

const { emailer } = require('../lib/fetch')

emailer("Testing 123", "💸 Ahoy there! 💸");
