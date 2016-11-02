var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var myBoot = require('./myBot.js')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

app.get('/', function (req, res) {
  console.log("dans la conec")
  res.send("Mon bot fonctionne !");
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


// send rich message with kitten
function kittenMessage(id, text) {

  text = text || "";
  var values = text.split(' ');
  if (values.length === 3 && values[0] === 'kitten') {
    if (Number(values[1]) > 0 && Number(values[2]) > 0) {
      var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
      message = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Kitten",
              "subtitle": "Cute kitten picture",
              "image_url": imageUrl ,
              "buttons": [{
                "type": "web_url",
                "url": imageUrl,
                "title": "Show kitten"
              }, {
                "type": "postback",
                "title": "I like this",
                "payload": "User " + id + " likes kitten " + imageUrl,
              }]
            }]
          }
        }
      };
      sendMessage(id, message);
      return true;
    }
  }
  return false;
};

// generic function sending messages
function sendMessage(recipientId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};

// handler receiving messages

function onMessageExempleAction(id, text) {
  if (!kittenMessage(id, text)) {
    sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
  }
}

function onMessageBotAction(id, text) {
  for (config of myBoot) {
    console.log("ici")
    console.log(config)
  }
}

function onMessage(req, res) {
  var events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
    var event = events[i];
      if (event.message && event.message.text) {
        onMessageBotAction(event.sender.id, event.message.text)
    }
  }
  res.sendStatus(200);
}


app.post('/webhook', onMessage);
