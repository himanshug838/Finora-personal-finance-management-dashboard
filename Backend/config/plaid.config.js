import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
} from "plaid";

import dotenv from "dotenv";

dotenv.config();

const environment =
  process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  basePath:
    PlaidEnvironments[environment],

  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID":
        process.env.PLAID_CLIENT_ID,

      "PLAID-SECRET":
        process.env.PLAID_SECRET,
    },
  },
});

const plaidClient =
  new PlaidApi(configuration);

export default plaidClient;