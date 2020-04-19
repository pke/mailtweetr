module.exports = function(cardId, comment) {
  return ["POST", `cards/${cardId}/actions/comments?text=${encodeURI(comment)}`]
}