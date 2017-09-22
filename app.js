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
  var username = session.userData['UserName']
  if (!username) {
    return session.beginDialog('greet')
  }
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

bot.dialog('greet', new builder.SimpleDialog((session, results) => {
  
    if(results && results.response) {
      session.userData['UserName'] = results.response
      session.privateConversationData['isGreeted'] = true
      return session.endDialog('%s! %s', results.response, 'Hello, I am Skyscraper Bot!')
    }
    
    builder.Prompts.text(session, 'Hello. Before we get started, please tell me your name?')
}))

const getMembersAddedMsg = membersAdded => {
  return membersAdded
    .map(u => u.name)
    .join(', ') + ' has joined.'
}