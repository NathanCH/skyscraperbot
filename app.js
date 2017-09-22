var restify = require('restify')
var builder = require('botbuilder')

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('It\'s running on %s.', server.url)
})

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})

server.post('/api/messages', connector.listen())


const bot = new builder.UniversalBot(connector, session => {
  session.send('%s ...is there an echo in here?', session.message.text)
})

bot.on('conversationUpdate', message => {
  if (message.membersAdded && message.membersAdded.length) {
    var membersAddedMsg = getMembersAddedMsg(message.membersAdded)
    bot.send(
      new builder.Message()
        .address(message.address)
        .text(membersAddedMsg)
    )
  }
});

const getMembersAddedMsg = membersAdded => {
  return 'Everbody welcome ' + membersAdded
    .map(function(u) { return u.name })
    .join(', ')
}