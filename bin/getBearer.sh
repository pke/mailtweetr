#! node

require("dotenv").config()
const Twitter = require("twitter-lite")

async function getBearerToken() {
  const user = new Twitter({
    consumer_key: process.env["TWITTER_CONSUMER_KEY"],
    consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
    access_token_key: process.env["TWITTER_ACCESS_TOKEN"],
    access_token_secret: process.env["TWITTER_ACCESS_TOKEN_SECRET"],
  })
  const response = await user.getBearerToken()
  console.log(response.access_token)
}

getBearerToken()