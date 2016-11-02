
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

export default config = [
  {
    word: "kitten",
    place: 0,
    type: "function",
    content: kittenMessage,
  },
  {
    word: "kitten",
    place: null,
    type: "message",
    content: "Oh, you love kitten? try >kitten 300 400"
  }
]
