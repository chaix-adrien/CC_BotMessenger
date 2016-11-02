var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

/*
*
* CONFIG
*
*/

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

/*
*
* SEND FONCTIONS
*
*/

// Envoi final
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

function pictureMessage(id, urlPicture) {
  message = {
    "attachment": {
      "type": "image",
      "payload": {
        "url": urlPicture ,
      }
    }
  };
  sendMessage(id, message);
};

function audioMessage(id, audioUrl) {
  message = {
    "attachment": {
      "type": "audio",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "url": urlPicture ,
        }]
      }
    }
  };
  sendMessage(id, message);
}

function textMessage(id, text) {
  sendMessage(id, {text: text})
}

/*
*
* HANDLER
*
*/

function onMessageExempleAction(id, text) {
  if (!kittenMessage(id, text)) {
    sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
  }
}

function onMessageBotAction(id, text) {
  const words = text.split(' ')
  for (config of myBot) { //on boucle sur les differentes config
    console.log(config)
    for (word of words) { //pour chaques config, on boucle sur tout les mots reçut
      console.log("word:", word)
      if (word === config.word) { //si le mot est celui de la config
        console.log("word match")
        if (config.type === "message") { //on dispatch les differents types d'action (message / function / photo oû content = url ...)
          console.log("send message:", config.content)
          textMessage(id, config.content)
          return //on valide
        } else if (config.type === "function") {
          console.log("call function:", config.content)
          if (config.content(id, text)) { //si la fonction valide la saisie et la traite
            console.log("VALID")
            return //on valide
          }
          console.log("INVALID")
        }
      }
    }
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


/*
*
* BOT CONFIG
*
*/
const myBot = [
  {
    word: "kitten",
    type: "function",
    content: kittenMessage,
  },
  {
    word: "kitten",
    type: "message",
    content: "Oh, you love kitten? try \"kitten 300 400\""
  },
]


/*
*
* BOT FUNCTIONS
*
*/

// send rich message with kitten
function kittenMessage(id, text) {

  text = text || "";
  var values = text.split(' ');
  if (values.length === 3 && values[0] === 'kitten') {
    if (Number(values[1]) > 0 && Number(values[2]) > 0) {
      var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
      const buttons = [{
        "type": "web_url",
        "url": imageUrl,
        "title": "Show kitten"
      }, {
        "type": "postback",
        "title": "I like this",
        "payload": "User " + id + " likes kitten " + imageUrl,
      }]
      pictureMessage(id, imageUrl, "Hello");
      return true;
    }
  }
  return false;
};
