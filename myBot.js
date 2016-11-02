const questionMessage = require('./index.js')


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
      questionMessage(id, message, buttons);
      return true;
    }
  }
  return false;
};

const config = [
  {
    word: "kitten",
    type: "function",
    content: kittenMessage,
  },
  {
    word: "kitten",
    type: "message",
    content: "Oh, you love kitten? try >kitten 300 400"
  }
]

module.exports = config
