const https = require("https")

async function request(options, data) {
  return new Promise(function(resolve, reject) {
    console.log("request", options)
    const request = https.request(options, function(response) {
      let body = ""
      response.on("data", function(data) {
        body += data
      })
      response.on("end", function(data) {
        if (data) {
          body += data
        }
        resolve({
          request,
          response,
          body: JSON.parse(body.toString())
        })
      })
    })
    request.on("error", reject)
    data && request.write(JSON.stringify(data))
    request.end()
  })
}

module.exports = async function([method, path, data]) {
  const queryDelimiter = path.indexOf("?") === -1 ? "?" : "&"
  path += `${queryDelimiter}key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
  return request({
    method,
    hostname: "api.trello.com",
    path: `/1/${path}`,
    headers:  {
      "Content-Type": "application/json",
    }
  }, data)
}