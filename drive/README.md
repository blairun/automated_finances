# Automated Finances - Setup and Help

## Install Dependencies

This project uses Node.js. Run `npm install` in the repo root to install necessary dependencies.

## Setting up API keys

First things first - rename `.env.sample` to `.env`. Variables in this file will be loaded as environment variables. This file is ignored by Git.


### Google Drive

- Enable the Google Drive API in your project. Download the credentials JSON file. Take a look at the file and fill in the following fields in `.env`:

  - `DRIVE_CLIENT_ID`
  - `DRIVE_CLIENT_SECRET`
  - `DRIVE_REDIRECT_URI` (use the first item in `redirect_uri`)

- Run `npm run token-drive`. This will prompt for auth and save the token in `.env`.

- Now run `npm run test-drive`. You should see a list of files in your drive with their file id.

