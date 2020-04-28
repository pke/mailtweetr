require("dotenv").config()
//console.log(process.env)

const tweetThread = require("../src/twitter/tweetThread")
const runTrello = require("../src/trello/runTrello")
const getCard = require("../src/trello/getCard")
const cardToTweet = require("../src/trello/cardToTweet")
const moveCard = require("../src/trello/moveCard")
const addCommentToCard = require("../src/trello/addCommentToCard")

const validateRequest = require("../src/trello/validateRequest")

async function processCard(card) {
  console.log("card", card)

  // Wait for potential attachments to be added in trello
  await new Promise(resolve => setTimeout(resolve, 2000))

  const { body: fullCard } = await runTrello(getCard(card.id, ["desc,name&attachments=true"]))
  console.log("fullCard:", fullCard)

  const thread = cardToTweet(fullCard)
  console.log("thread", thread)

  let { tweets, error } = await tweetThread(thread)
  console.log("tweets", tweets)
  console.log("error", error)

  if (error) {
    await runTrello(addCommentToCard(fullCard.id, "```" + error + "```"))
  } else {
    try {
      for (const tweet of tweets) {
        await runTrello(addCommentToCard(fullCard.id, "```" + JSON.stringify(tweet, null, 2) + "```"))
      }
    } catch (e) {
      error = e
      console.error("error", error)
    }
  }
  const targetListId = error ? process.env.TRELLO_ERROR_LIST_ID : process.env.TRELLO_SUCCESS_LIST_ID
  await runTrello(moveCard(fullCard.id, targetListId))
}

module.exports = async function(request, response) {
  //console.log(request.headers)
  console.log("request.body", JSON.stringify(request.body, null, 2))

  // Trello will call our webhook with HEAD to ensure it works
  if (request.method === "HEAD") {
    response.status(200).end()
  } else if (request !== "POST") {
    response.status(405).end()
  }
  if (validateRequest(request, process.env.TRELLO_SECRET, process.env.TRELLO_CALLBACK_URL)) {
    const { action } = request.body
    const { type, data } = action
    const card = data.card
    const listAfter = data.listAfter && data.listAfter.id
    if (type === "emailCard"
      || type === "createCard"
      || (type === "updateCard"
          && listAfter === process.env.TRELLO_INCOMING_LIST_ID)) {
      processCard(card).catch(console.error.bind(this))
    }
  }
  response.end()
}