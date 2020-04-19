module.exports = function(cardId, fields = []) {
  return ["GET", `cards/${cardId}?fields=${fields.join(",")}`]
}