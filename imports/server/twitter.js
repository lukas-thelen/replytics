import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';
import { Follower } from '../api/twitter_follower.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';

var Twit = require('twit');	//https://github.com/ttezel/twit


async function getFollowers(){	//Funktion für den Abruf und zur Berechnung der Followeranzahl
	var follower = []
	let result = await TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"});	//Holt die IDs der Follower abhängig von screen_name/Benutzername
	follower = result.data.ids.length;	//Gibt die Anzahl der Follower anhand der Zahl der Elemente aus
	Follower.insert({count: follower, date: new Date()});	//Speichert die Followerzahl zusammen mit dem Datum des Abrufs in der Collection "Follower"
	console.log(Follower.find({}).fetch())
}


async function getMentions(){	//Funktion für den Abruf und zur Berechnung der @-Erwähnungen durch andere Benutzer
	let result = await TwitterAPI.get('statuses/mentions_timeline', { screen_name:"@FlorianKindler"});	//Ruft alle Posts ab die den entsprechenden screen_name/Benutzernamen enthalten
	mentionArray = result.data;
	var authorCount = 0

	for (i=0; i<mentionArray.length; i++){	//Funktion um festzustellen wie viele unterschiedliche Autoren den Benutzer in ihren Posts erwähnen
		var author = Mentions.find({author: mentionArray[i].user.name}).fetch();
		if(!author[0]){	//Erhöht den Counter, wenn der/die AutorIn bisher noch nicht vorgekommen ist
			authorCount ++
		}	
		Mentions.insert({	//Abspeicherung der relevanten Daten in der Collection "Mentions"
			date: mentionArray[i].created_at,
			id01: mentionArray[i].id,
			id02: mentionArray[i].id_str,
			content: mentionArray[i].text,
			author: mentionArray[i].user.name
		})

	}
	MentionCount.insert({date: new Date(), mentions: mentionArray.length, authors: authorCount}) //Abspeicherung des Datum wann die Daten abgerufen wurden, der Anzahl der Erwähnungen, der Anzahl der verschiedenen Autoren
	console.log(Mentions.find({}).fetch())
	console.log(MentionCount.find({}).fetch())
}

export function initial(){
	MentionCount.remove({});
	Follower.remove({});
	Mentions.remove({});
	getFollowers();
	getMentions();
}
