const plaid = require('plaid')

module.exports = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET_development,
  env: plaid.environments.development,
  // secret: process.env.PLAID_SECRET_sandbox,
  // env: plaid.environments.sandbox,
  options: {
    version: '2019-05-29'
  }
})
