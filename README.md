# Automated Finances - Setup and Help

This project is a fork of https://github.com/yyx990803/build-your-own-mint with several added features.

## Install Dependencies

Run `npm install` in the repo root to install necessary Node.js dependencies.

## Setting up API keys

Create an `.env` file in the root directory. Variables in this file will be loaded as environment variables. This file is ignored by Git.

### Plaid

- You will first need to sign up for [Plaid](https://plaid.com/) and apply for the development plan. You might need to wait for a day or two to get approved. It's free and limited to 100 items (i.e. banks), so it should be more than enough for personal use.

- Once approved, fill out the following in `.env`:

  - `PLAID_CLIENT_ID=`
  - `PLAID_SECRET=`
  - `PLAID_PUBLIC_KEY=`

- Now you need to connect to your financial institutions to generate access tokens.

  Run `npm run token-plaid <account>` where `account` is an id for the bank you want to connect (it's for your personal reference, so you can name it anything). This will start a local server which you can visit in your browser and go through the authentication flow. Once you've linked the bank, its associated access token will be saved in `.env`.

  If the script is run from a networked computer then just replace "localhost" with the IP of the networked computer. E.g. http://192.168.1.150:8080/

  This process needs to be repeated for each bank you want to connect. Make sure to run each with a different `account` name.

- If you've done everything correctly, running `npm run test-plaid` now should log the recent transactions in your connected accounts.

> Change environment from development to sandbox by commeniting/uncommenting the env variables in plaidClient.js and plaid.ejs. 

> If you need to update credentials or remove an account, run `npm run token-plaid whatever`, to bring up the client in your browser. Follow the instructions on the webpage to update or remove your Plaid item.

### Google Sheets

- First, create a Google Sheets spreadsheet, and save its ID in `.env` as `SHEETS_SHEET_ID=`.

- Then, go to [Google Sheets API Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs), and click the "Enable the Google Sheets API" button. Follow instructions and download the credentials JSON file. Take a look at the file and fill in the following fields in `.env`:

  - `SHEETS_CLIENT_ID=`
  - `SHEETS_CLIENT_SECRET=`
  - `SHEETS_REDIRECT_URI=` (use the first item in `redirect_uri`)

- Run `npm run token-sheets`. This will prompt for auth and save the token in `.env`.

- Now run `npm run test-sheets`. You should see your sheet's cell A1 with "It worked!".

## Transform your Data

- With the APIs sorted out, now it's time to connect them. Open `lib/transform_*.js` - this is where you can write your own logic to map incoming balances and transactions to cell updates. How to structure the spreadsheet to use that data is up to you.

- You can adjust the transaction date range in `lib/fetch.js`.

- Once you've setup your own transform logic, run `node update_*.js`. If everything works, your spreadsheet should have been updated.

## View History

Code in the '/drive' folder archives a copy of the Finances spreadsheet each day. The spreadsheet has a script that allows it to access those archived files in order to compare snapshots of finances at certain dates in the past.

## Automate the Updates

Adjust the cron config to tweak the time/frequency of the updates. For example, update transactions daily at midnight and noon.

See this link for help running Node.js applications as cron job:
https://stackoverflow.com/questions/5849402/how-can-you-execute-a-node-js-script-via-a-cron-job

See here for refresher on updating cron jobs:
https://www.ostechnix.com/a-beginners-guide-to-cron-jobs/


