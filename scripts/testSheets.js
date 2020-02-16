require('dotenv').config()

const { updateSheet } = require('../lib/updateSheet')

updateSheet([{
  range: 'A1',
  values: [['It worked!']]
}])
