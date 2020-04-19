const crypto = require("crypto")

module.exports = function validateRequest(request, secret, callbackURL) {
  var base64Digest = function (s) {
    return crypto.createHmac('SHA1', secret).update(s).digest('base64')
  }
  var content = JSON.stringify(request.body) + callbackURL
  var doubleHash = base64Digest(content)
  var headerHash = request.headers['x-trello-webhook']
  return doubleHash == headerHash
}
