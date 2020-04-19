require("dotenv").config()
const Twitter = require("twitter-lite")

const client = new Twitter({
  consumer_key: process.env["TWITTER_CONSUMER_KEY"],
  consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
  access_token_key: process.env["TWITTER_ACCESS_TOKEN"],
  access_token_secret: process.env["TWITTER_ACCESS_TOKEN_SECRET"],
})  

async function tweetThread(thread) {
  thread = Array.isArray(thread) ? thread : [thread]
  const result = {
    threadIndex: 0,
    tweets: [],
    lastTweetID: "",
    error: undefined,
  }
  try {
    for (const status of thread) {
      const tweet = await client.post("statuses/update", {
          status,
          in_reply_to_status_id: result.lastTweetID,
          auto_populate_reply_metadata: true
      })
      result.tweets.push(tweet)
      ++result.threadIndex
      result.lastTweetID = tweet.id_str
    }
  } catch (error) {
    if (error.errors) {
      result.error = error.errors.map(({ message }) => message).join("\n")
    } else {
      result.error = error.message
    }
    //console.error(result.error)
  }
  return result
}

module.exports = tweetThread

if (require.main === module) {
  //tweetThread(["TweetMailr test"]).catch(console.error)
  /*client.get("account/verify_credentials")
  .then(results => {
    console.log("results", results)
  })
  .catch(console.error)*/
} else {
}