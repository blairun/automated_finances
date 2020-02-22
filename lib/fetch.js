"use strict";
const moment = require("moment");
const client = require("./plaidClient");
const { updateSheet } = require("./updateSheet");
const nodemailer = require("nodemailer");

// start from beginning of last month...
// const startDate = moment()
//   .subtract(1, 'month')
//   .startOf('month')
//   .format('YYYY-MM-DD');
// start from 12 months ago...
const startDate = moment()
  .subtract(6, "month")
  .startOf("month")
  .format("YYYY-MM-DD");
// ends now.
// this ensures we always fully update last month,
// and keep current month up-to-date
const endDate = moment().format("YYYY-MM-DD");

const transactionFetchOptions = [
  startDate,
  endDate,
  {
    count: 250,
    offset: 0
  }
];

const plaidAccountTokens = Object.keys(process.env)
  .filter(key => key.startsWith(`PLAID_TOKEN`))
  .map(key => ({
    account: key.replace(/^PLAID_TOKEN_/, ""),
    token: process.env[key]
  }));

exports.fetchTransactions = async function() {
  const rawTransactions = await Promise.all(
    plaidAccountTokens.map(({ account, token }) => {
      client.getTransactions(token, ...transactionFetchOptions, (err, res) => {
        if (err != null) {
          var error =
            account.toUpperCase() +
            " / Transactions / " +
            err.error_code +
            ": " +
            err.error_message;
          console.log(error);
          updateSheet([
            {
              range: "PlaidTransactionError",
              values: [[error]]
            }
          ]);
          exports.emailer("Plaid Error", error);
        }
        // console.log(res);
      });
      return client
        .getTransactions(token, ...transactionFetchOptions)
        .then(({ transactions }) => ({
          account,
          transactions
        }));
    })
  );

  // concat all transactions
  return rawTransactions.reduce((all, { account, transactions }) => {
    return all.concat(
      transactions.map(({ name, account_id, date, amount, pending, category }) => ({
        account,
        account_id,
        date,
        name,
        amount: -amount,
        pending,
        category: String(category) //https://github.com/yyx990803/build-your-own-mint/pull/16
      }))
    );
  }, []);
};

exports.fetchAllBalances = async function() {
  // try {
    // this avoids promise rejection errors but also allows code to continue execution which
    // ends up deleting existing balance data without repalcing it, if there is an error.
    // doSomethingUnsavory();
    // console.log("top1");
    const rawBalances = await Promise.all(
      plaidAccountTokens.map(({ account, token }) => {
        // console.log("top2");
        // console.log(account);
        client.getBalance(token, (err, res) => {
          if (err != null) {
            var error =
              account.toUpperCase() +
              " / Balances / " +
              err.error_code +
              ": " +
              err.error_message;
            console.log(error);
            updateSheet([
              {
                range: "PlaidBalanceError",
                values: [[error]]
              }
            ]);
            exports.emailer("Plaid Error", error);
          }
          // console.log(res);
        });

        return client.getBalance(token);
      })
    );
    // console.log("bottom1");
     return rawBalances.reduce((all, { accounts }) => {
      // console.log("bottom2");
      return all.concat(
        accounts.map(({ name, account_id, balances }) => ({
          account_id,
          name,
          available_balance: balances.available,
          current_balance: balances.current,
          limit: balances.limit,
          date: moment().format("MM/DD/YYYY")
        }))
      );
    }, []);
  // } catch (error) {
  //   //"handleUnsavoriness"
  //   // console.log(error);
  // }
};


exports.fetchItemBalances = async function(itemToken) {
  try {
  // console.log("top1");
  return new Promise((resolve, reject) => {
    // console.log("top2");
    client.getBalance(itemToken, (err, result) => {
      // Handle err
      if (err != null) {
        const tokenToAccount = plaidAccountTokens.find( ({ token }) => token === itemToken );
        var error =
          // account.toUpperCase() +
          tokenToAccount.account.toUpperCase() +
          " / Balances / " +
          err.error_code +
          ": " +
          err.error_message;
        // console.log(error);
        updateSheet([
          {
            range: "PlaidBalanceError",
            values: [[error]]
          }
        ]);
        // exports.emailer("Plaid Error", error);
        // resolve([{
        //   account_id: '',
        //   name: '',
        //   available_balance: 0,
        //   current_balance: 0,
        //   limit: 0,
        //   date: '' 
        //   }])
        }
      else {
      // return accounts
      // console.log(result);
      const accounts = result.accounts;
      // console.log(accounts);
      var balanceArray = accounts.map(({ name, account_id, balances }) => ({
          account_id,
          name,
          available_balance: balances.available,
          current_balance: balances.current,
          limit: balances.limit,
          date: moment().format("M/D/Y")
        }));
      console.log(balanceArray);
      // return balanceArray
      resolve(balanceArray);
      }
    });
  });
} catch (error) {
    // console.log(error)
}
};


// async..await is not allowed in global scope, must use a wrapper
exports.emailer = async function(subject, body) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `${process.env.GMAIL_USER}@gmail.com`, // generated ethereal user
      pass: process.env.GMAIL_APP_PASS // generated ethereal password
      // https://stackoverflow.com/questions/26736062/sending-email-fails-when-two-factor-authentication-is-on-for-gmail
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"me 👻" <${process.env.GMAIL_USER}@gmail.com>`, // sender address
    to: `${process.env.GMAIL_USER}+automated_finances@gmail.com`, // list of receivers
    subject: subject, // Subject line
    text: body // plain text body
    // html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
