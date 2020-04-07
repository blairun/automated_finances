require('dotenv').config()

const { updateSheet } = require('./lib/updateSheet')

const moment = require('moment')
const date = moment().format('M/D/Y');

;(async () => {
  updateSheet([
    {
      range: "BillsDate",
      values: [[date]]
    }
  ]);
})()