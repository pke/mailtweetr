//#! node

require("dotenv").config()
const https = require("https")

const request = https.request({
  method: "POST",
  hostname: "api.trello.com",
  path: `/1/tokens/${process.env.TRELLO_API_TOKEN}/webhooks/`,
  headers:  {
    "Content-Type": "application/json",
  }
}, function(response) {
  console.log(`statusCode: ${response.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})
request.on("error", function(error) {
  console.log(error)
  process.exit(1)
})
request.write(JSON.stringify({
  key: process.env.TRELLO_API_KEY,
  idModel: process.env.TRELLO_INCOMING_LIST_ID,
  callbackURL: process.env.NOW_URL + "/api/trello",
  description: "tweetmailr hook for incoming list changes"
}))
request.end()