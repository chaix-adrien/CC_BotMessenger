##PRERQUIS
node.js
Heroku (https://devcenter.heroku.com/articles/heroku-command-line)
Heroku => creer un compte
heroku => set le script start (https://devcenter.heroku.com/articles/nodejs-support#default-web-process-type) avec index.js au lieu de server.js

##API
Expliquer le principe d'une api
Expliquer le but d'une clef API

##index.js
expliquer le principe de requette (POST / GET / URL)
verify_token && testbot_verify_token configurable mais a modifier par la suite ducoup

##Facebook
Leurs expliquer comment convertir les requettes de:
https://developers.facebook.com/docs/messenger-platform/product-overview/conversation
en code comme "kittenMessage" dans index.js (creer une fonction par type de reponse)
-faire passer le callback du post webhook dans une fonction a part (plus clair)

-dans un premier temps, ils essaie les fonction les une apres les autres en remplacant la fonction appelé de l'exemple
-dans un second temps, ils mettent en place le JSON pour faire les recherche automatique
  -creer myBot.js
  -expliquer pourquoi les return true / false sont necessaire
  (si true, alors t'arrete de chercher une reponse, si false, le message a pas rempli les conditions pour cette reponse la et peut matcher avec une autre)
