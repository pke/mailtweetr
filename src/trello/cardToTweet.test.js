const assert = require("chai").assert

const cardToTweet = require("./cardToTweet")

describe("Convert trello card to tweet data", function() {
  it("should throw with missing card name", function() {
    assert.throws(() => cardToTweet({ desc: "A desc" }))
    assert.throws(() => cardToTweet({ name: "" }))
    assert.throws(() => cardToTweet({ name: null }))
  })

  it("should extract title and description", function() {
    const tweetData = cardToTweet({
      name: "First Tweet",
      desc: "This is my first tweet",
    })
    assert.equal(tweetData, "First Tweet\nThis is my first tweet")
  })

  it("should extract only title", function() {
    const tweetData = cardToTweet({
      name: "First Tweet",
    })
    assert.equal(tweetData, "First Tweet")
  })
})