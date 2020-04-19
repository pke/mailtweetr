module.exports = function moveCard(cardId, toList) {
  return [ "PUT", `cards/${cardId}`, {
    id: cardId,
    idList: toList,
    pos: "top",
  }]
}