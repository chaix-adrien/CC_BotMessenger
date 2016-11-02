##PRERQUIS
node.js
Heroku (https://devcenter.heroku.com/articles/heroku-command-line)
Heroku => creer un compte
heroku => set le script start (https://devcenter.heroku.com/articles/nodejs-support#default-web-process-type) avec index.js au lieu de server.js


##JS
specificité js:
  === / !==
  for of
  string.split()
  string / array .indexOff
  toLowerCase

##index.js
verify_token && testbot_verify_token configurable mais a modifier par la suite ducoup
POUR LES LOG DE DEBUG:
  console.log() dans le programe
  heroku logs -t dans un term

##Facebook
Leurs expliquer comment convertir les requettes de:
https://developers.facebook.com/docs/messenger-platform/product-overview/conversation
en code comme "kittenMessage" dans index.js
-faire passer le callback du post webhook dans une fonction a part (plus clair: onMessage)

-dans un premier temps, ils codent les fonction les une apres les autres en remplacant la fonction appelé de l'exemple
textMessage
audioMessage
fileMessage
videoMessage
pictureMessage
questionMessage(id, urlPicture, title, subtitle, buttons)

-dans un second temps, ils definissent un objet myBot qui fera le lien, puis creent les fonctions callback
  -expliquer pourquoi les return true / false sont necessaire dans les callback
  (si true, alors t'arrete de chercher une reponse, si false, le message a pas rempli les conditions pour cette reponse la et peut matcher avec une autre)
  -expliquer le principe de fonctionnement de fetch
  (npm install --save isomorphic-fetch es6-promise // var fetch = require('isomorphic-fetch'))
  -fetch(url).then(r=>r.json()).then(rep => {
  doStuff
  })
  leurs donner la syntaxe
-Puis ils font la fonction qui va utliser les liens (onMessageBotAction)

##API
Expliquer le principe d'une api
Expliquer le but d'une clef API
