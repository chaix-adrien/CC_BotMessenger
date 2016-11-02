var fetch = require('isomorphic-fetch')

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

function questionMessage(id, urlPicture, title, subtitle, buttons) {
  const message = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[{
          "title": title,
          "image_url": urlPicture,
          "subtitle": subtitle,
          "buttons":buttons,
        }]
      }
    }
  };
  sendMessage(id, message);
  return true
}

function pictureMessage(id, urlPicture) {
  const message = {
    "attachment": {
      "type": "image",
      "payload": {
        "url": urlPicture ,
      }
    }
  };
  sendMessage(id, message);
  return true
};

function audioMessage(id, urlAudio) {
  const message = {
    "attachment": {
      "type": "audio",
      "payload": {
        "url": urlAudio
      }
    }
  };
  sendMessage(id, message);
  return true
}

function fileMessage(id, urlFile) {
  const message = {
    "attachment": {
      "type": "file",
      "payload": {
        "url": urlFile
      }
    }
  };
  sendMessage(id, message);
  return true
}

function videoMessage(id, urlVideo) {
  const message = {
    "attachment": {
      "type": "video",
      "payload": {
        "url": urlVideo
      }
    }
  };
  sendMessage(id, message);
  return true
}

function textMessage(id, text) {
  const message = {
    text: text,
  }
  sendMessage(id, message)
  return true
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
    for (word of words) { //pour chaques config, on boucle sur tout les mots reçut
      for (configWord of config.word) {
        if (word === configWord) { //si le mot est celui de la config
          if (config.type === "message") { //on dispatch les differents types d'action (message / function / photo oû content = url ...)
            textMessage(id, config.content)
            return //on valide
          } else if (config.type === "function") {
            if (config.content(id, text)) { //si la fonction valide la saisie et la traite
              return //on valide
            }
          }
        }
      }
    }
  }
}

function onMessage(req, res) {
  console.log("Message recu")
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
    word: ["help"],
    type: "message",
    content: "Pour commencer, essaie \"audio\", \"video\", \"repete\" ou \"chat\"",
  },
  {
    word: ["XxCOBRAxX"],
    type: "function",
    content: displayAllBot,
  },
  {
    word: ["chat", "cat"],
    type: "function",
    content: sendCatPicture,
  },
  {
    word: ["chat", "cat"],
    type: "message",
    content: "t'aime les pitis chat? Essaie \"chat 300 400\""
  },
  {
    word: ["repete"],
    type: "function",
    content: textMessage,
  },
  {
    word: ["song"],
    type: "function",
    content: rickroll,
  },
  {
    word: ["audio"],
    type: "function",
    content: sendSampleAudio,
  },
  {
    word: ["video"],
    type: "function",
    content: sendSampleVideo,
  },
  {
    word: ["search", "cherche"],
    type: "function",
    content: searchThis,
  },
  {
    word: ["meme"],
    type: "function",
    content: createMeme,
  }, 
]


/*
*
* BOT FUNCTIONS
*
*/

// send rich message with kitten
function sendCatPicture(id, text) {
  console.log(JSON.stringify(myBot))
  text = text || "";
  var values = text.split(' ');
  if (values.length === 3 && (values[0] === 'chat' || values[0] === 'cat')) {
    if (Number(values[1]) > 0 && Number(values[2]) > 0) {
      var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
      const buttons = [{
        "type": "web_url",
        "url": imageUrl,
        "title": "Agrandir"
      }, {
        "type": "postback",
        "title": "J'aime ce chat",
        "payload": "repete",
      }]
      questionMessage(id, imageUrl, "Voici un petit chat", "avou il est trop kawai", buttons);
      return true;
    }
  }
  return false;
};

function rickroll(id, text) {
  if (text.toLowerCase().indexOf("what's the name of the song") !== -1) {
    textMessage(id, "https://www.youtube.com/watch?v=oHg5SJYRHA0")
    return true
  }
  return false
}

function displayAllBot(id, text) {
  for (config of myBot) {
    textMessage(id, JSON.stringify(config))
  }
  return true
}

function sendSampleAudio(id, text) {
  textMessage(id, "ça arrive, on a pas la fibre a la campagne!")
  audioMessage(id, "http://www.auboutdufil.com/get.php?web=https://archive.org/download/auboutdufil-archives/485/Kubbi-Ember-04Cascade.mp3")
  return true
}

function sendSampleVideo(id, text) {
  textMessage(id, "ça arrive, on a pas la fibre a la campagne!")
  videoMessage(id, "https://s3.amazonaws.com/distill-videos/videos/processed/1007/2014-12-20-01.mp4.mp4")
  return true
}

function searchThis(id, text) {
  var search = ""
  if (text.toLowerCase().indexOf("search ") !== -1) {
    search = text.split("search ")[1]
  } else search = text.split("cherche ")[1]
  textMessage(id, "https://www.google.com/search?q=" + encodeURI(search) +"&btnI=")
  return true
}

function createMeme(id, text) {
  const param = text.split("meme ")[1].split(" ")
  if (param.length > 2) {
    var urlPic = param[0]
    const first = param[1]
    const last = param[2]
    pictureMessage(id, "https://memegen.link/custom/" + first + (last ? ("/" + last) : "") + ".jpg?alt=" + urlPic)
    
    return true
  }
  return false
}
