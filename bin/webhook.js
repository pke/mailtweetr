require("dotenv").config()
const https = require("https")

console.log(process.env)

const request = https.request({
  method: "POST",
  hostname: "api.trello.com",
  path: `/1/tokens/${process.env.TRELLO_API_TOKEN}/webhooks/`,
  headers: {
    "Content-Type": "application/json",
  }
}, function(response) {
  console.log(`statusCode: ${response.statusCode}`)
  const out = process.stdout.write.bind(process.stdout)
  response.on("data", out)
  response.on("end", out)
})
request.on("error", function(error) {
  console.error(error)
  process.exit(1)
})
request.write(JSON.stringify({
  key: process.env.TRELLO_API_KEY,
  idModel: process.env.TRELLO_INCOMING_LIST_ID,
  callbackURL: process.env.TRELLO_CALLBACK_URL,
  description: "tweetmailr hook for incoming list changes"
}))
request.end()