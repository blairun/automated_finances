require('dotenv').config()

const { fetchTransactions } = require('./lib/fetch')
const { transformTransactionsToUpdates } = require('./lib/transform_transactions')
const { updateSheet } = require('./lib/updateSheet')
const { clearContents } = require('./lib/updateSheet')

const moment = require('moment')
const date = moment().format('M/D/Y, hA');

;(async () => {
  
  const transactions = await fetchTransactions()
  
  await clearContents('TransactionSpace')

  await clearContents('PlaidTransactionError')

  const updates_transactions = transformTransactionsToUpdates(transactions)

  updateSheet(updates_transactions)

  updateSheet([{
    range: 'TransactionsUpdated',
    values: [[date]]
  }])

})()


