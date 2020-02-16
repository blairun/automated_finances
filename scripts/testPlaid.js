require('dotenv').config()

const path = require('path')
const { writeFile } = require('fs-extra')
const { fetchTransactions } = require('../lib/fetch')
const { fetchAllBalances } = require('../lib/fetch')

;(async () => {
  const res = await fetchTransactions()
  console.log('Transactions fetch successful!')
  console.log(res)

  // const res = await fetchAllBalances()
  // console.log('Balances fetch successful!')
  // console.log(res)
})()
