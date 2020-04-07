require('dotenv').config()

const { updateSheet } = require('../lib/updateSheet')

updateSheet([{
  range: 'A2',
  values: [['It worked!']]
}])
