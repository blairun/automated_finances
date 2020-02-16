require('dotenv').config()
const { fetchAllBalances } = require('./lib/fetch')
const { fetchItemBalances } = require('./lib/fetch')
// const { plaidAccountTokens } = require('./lib/fetch')
const { transformBalancesToUpdates } = require('./lib/transform_balances')
const { updateSheet } = require('./lib/updateSheet')
const { rangePosition } = require('./lib/updateSheet')
const { clearContents } = require('./lib/updateSheet')

process.env.UV_THREADPOOL_SIZE = 128;
// https://stackoverflow.com/questions/35387264/node-js-request-module-getting-etimedout-and-esockettimedout

const moment = require('moment')
const date = moment().format('M/D/Y h:mA');


const plaidAccountTokens = Object.keys(process.env)
  .filter(key => key.startsWith(`PLAID_TOKEN`))
  .map(key => ({
    token: process.env[key]
  }));


;(async () => {
  const balances = await fetchAllBalances();
  // const balances = await fetchItemBalances(process.env.PLAID_TOKEN_citibank)
  // const balances = await fetchItemBalances(process.env.PLAID_TOKEN_bank_of_america)

  await clearContents("BalanceSpace");

  await clearContents("PlaidBalanceError");

  const updates_balances = transformBalancesToUpdates(balances);

  updateSheet(updates_balances);

  updateSheet([
    {
      range: "BalancesUpdated",
      values: [[date]]
    }
  ]);
})()


// ;(async () => {
//   // const forLoop = async _ => {
//   // for (const i of plaidAccountTokens) {
//     // try {
//     // console.log(i[Object.keys(i)[0]]);

//     // const balances = await fetchItemBalances(
//     //   i[Object.keys(i)[0]]
//     // );
//     // const balances = await fetchAllBalances()
//     // const balances = await fetchItemBalances(process.env.PLAID_TOKEN_wells_fargo)
//     const balances = await fetchItemBalances(process.env.PLAID_TOKEN_bank_of_america)

//     for (const account of balances) {
      
//       // await clearContents("BalanceSpace");

//       // await clearContents("PlaidBalanceError");
//       console.log(account)
//       delete account.account_id //remove first value from object
//       console.log(account)
//       var account_id = account[Object.keys(account)[0]]
//       console.log(account_id)

//       var row = rangePosition('BalanceSpace', account_id)

//       console.log(row)
//       const update_balance = await transformBalancesToUpdates(
//         'BalancesRaw',
//         'B',
//         'F',
//         [account],
//         row
//       );
//       updateSheet(update_balance);
//     }
//     // }
//     // } catch (error) {console.log(error)}
//   // }
//   // updateSheet([
//   //   {
//   //     range: "BalancesUpdated",
//   //     values: [[date]]
//   //   }
//   // ]);
// })()
