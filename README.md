# TweetMailr

## TL;DR

Create a tweet from a mail sent to a trello board.

## Inspiration

The best mobile phone system to date, Windows Phone 8.1, is not supported by #
Twitter anymore (and never really was embraced by their sub-par app).
Their mobile.twitter.com site on Windows Phone is utter shite.
(For instance it always causes a DNS error after tweeting. WTF?!)

So the idea is to send an email to a s specific address that would convert it to
one or more tweets. Subject and body would be converted to text and attached
media uploaded as this tweets media.

Since an email server can not be hosted on a lambda platform like zeit.co I will
use a trello board that can receive emails. For that board I register my lambda
as a webhook (which needs to respond to HEAD + POST) and create the tweet from
the trello card that was created from the sent email.

The cards title + description go to the tweet text and the cards attachments
with media content types become tweet media (up to 4 images or 1 gif).

1. Lambda receives trello hook for newly created cards
2. Lambda splits trello card title + descriptions to tweets
3. Card attachments with media content-type are uploaded as media
4. Tweets are posted
5. Card is moved to "Done" or "Error" list depending on tweeting results

## License

MIT
