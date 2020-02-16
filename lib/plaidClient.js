const plaid = require('plaid')

module.exports = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_PUBLIC_KEY,
  process.env.PLAID_SECRET_development,
  plaid.environments.development,
  // process.env.PLAID_SECRET_sandbox,
  // plaid.environments.sandbox,
  {
    version: '2019-05-29'
  }
)
