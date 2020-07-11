var Twit = require('twit');
import { credentials } from "./access_Token.js"


export var TwitterAPI = new Twit({
	consumer_key: credentials.key, // API key
	consumer_secret: credentials.token, // API secret
	access_token: "2909379863-zqmljlTQrLGZsXN4Q6lnvf7yoBZ7K6DjDl3Qm9y",
	access_token_secret: "KLocQGPdkSY9XI36f45AQGNKQ2xXSQdnoUyzmRJhjxIc7"});

//Twitter Developer Zugangsdaten. Notwendig um Daten abzurufen.
