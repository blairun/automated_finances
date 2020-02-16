require('dotenv').config()

const { emailer } = require('../lib/fetch')

emailer("Testing 123", "💸 Ahoy there! 💸");
