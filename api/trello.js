require("dotenv").config()
console.log(process.env)

const tweetThread = require("../src/twitter/tweetThread")
const runTrello = require("../src/trello/runTrello")
const getCard = require("../src/trello/getCard")
const cardToTweet = require("../src/trello/cardToTweet")
const moveCard = require("../src/trello/moveCard")
const addCommentToCard = require("../src/trello/addCommentToCard")

const validateRequest = require("../src/trello/validateRequest")

module.exports = async function(request, response) {
  //console.log(request.headers)
  console.log("request.body", request.body)

  // Trello will call our webhook with HEAD to ensure it works
  if (request.method === "HEAD") {
    response.status(200)
    return response.end()
  }

  if (request.method === "POST"
      && validateRequest(request, process.env.TRELLO_SECRET, process.env.NOW_URL + "/api/trello")) {
      const { action } = request.body
      const { type, data } = action
      const card = data.card
      if (type === "emailCard" || type === "createCard") {
        console.log("card", card)
        setTimeout(async () => {
          const { body: fullCard } = await runTrello(...getCard(card.id, ["desc,name&attachments=true"]))
          console.log("fullCard:", fullCard)
          const thread = cardToTweet(fullCard)
          console.log("thread", thread)
          const { tweets, error } = await tweetThread(thread)
          console.log("tweets", tweets)
          console.log("error", error)
          if (error) {
            await runTrello(...addCommentToCard(fullCard.id, "```" + error + "```"))
          } else {
            try {
              for (const tweet of tweets) {
                await runTrello(...addCommentToCard(fullCard.id, "```" + JSON.stringify(tweet, null, 2) + "```"))
              }
            } catch (error) {
              console.error("error", error)
            }
          }
          const targetListId = error ? process.env.TRELLO_ERROR_LIST_ID : process.env.TRELLO_SUCCESS_LIST_ID
          await runTrello(...moveCard(fullCard.id, targetListId))
        }, 2000)
      }
  }
  response.end()
}