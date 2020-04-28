const crypto = require("crypto")

module.exports = function validateRequest(request, secret, callbackURL) {
  const content = JSON.stringify(request.body) + callbackURL
  const doubleHash = crypto.createHmac("SHA1", secret).update(content).digest("base64")
  const headerHash = request.headers["x-trello-webhook"]
  console.log("callbackURL", callbackURL, "validateRequest", headerHash, doubleHash)
  return doubleHash == headerHash
}
