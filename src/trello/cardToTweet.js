module.exports = function cardToTweet(card) {
  if (!card.name) {
    throw new TypeError("Card name missing")
  }
  return [card.name, card.desc].filter(x => x).join("\n")
}
