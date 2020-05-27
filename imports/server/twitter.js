import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';
import { Follower } from '../api/twitter_follower.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';

var Twit = require('twit');	//https://github.com/ttezel/twit



//**Funktionen im Twitter Kontext**/

/*async function getFollowers(){	//Funktion für den Abruf und zur Berechnung der Followeranzahl
	var follower = []
	let result = await TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"});	//Holt die IDs der Follower abhängig von screen_name/Benutzername
	follower = result.data.ids.length;	//Gibt die Anzahl der Follower anhand der Zahl der Elemente aus
	Follower.insert({count: follower, date: new Date()});	//Speichert die Followerzahl zusammen mit dem Datum des Abrufs in der Collection "Follower"
	console.log(Follower.find({}).fetch())
}*/

//Ergänzt einen neuen Eintrag für die Followerzahlen, wenn heute noch kein Eintrag gemacht wurde oder der Wert von den bisherigen abweicht
async function getDailyFollowers(){
	var follower = []
	let result = await TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"});
	follower = result.data.ids.length;
	
	if (!checkDaily(Follower) || (!checkCount("count", follower, Follower) && checkDaily(Follower))){
		if(!checkCount("count", follower, Follower)){
			removeLast(Follower)
		}
		Follower.insert({count: follower, date: new Date()});
	}
	console.log(Follower.find({}).fetch())
}


async function getMentions(){	//Funktion für den Abruf und zur Berechnung der @-Erwähnungen durch andere Benutzer
	let result = await TwitterAPI.get('statuses/mentions_timeline', { screen_name:"@FlorianKindler"});	//Ruft alle Posts ab die den entsprechenden screen_name/Benutzernamen enthalten
	mentionArray = result.data;
	var mentions = mentionArray.length;
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
	if (!checkDaily(MentionCount) || (!checkCount("mentions", mentions, MentionCount) && checkDaily(MentionCount))){
		if(!checkCount("mentions", mentions, MentionCount)){
			removeLast(MentionCount)
		}
		MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount}) //Abspeicherung des Datum wann die Daten abgerufen wurden, der Anzahl der Erwähnungen, der Anzahl der verschiedenen Autoren
	}
	console.log(Mentions.find({}).fetch())
	console.log(MentionCount.find({}).fetch())
}


export function initial(){
	Mentions.remove({});
	getDailyFollowers();
	getMentions();
}


//**allgemeine Funktionen**/

//gibt true zurück wenn Collection bereits einen Eintrag mit heutigem Datum enthält 
function checkDaily(collection){
	var today = new Date();
	var latestObject = collection.findOne({},{ sort:{ date:-1 } })
	if(latestObject.date.getDay() === today.getDay() && latestObject.date.getMonth() === today.getMonth() && latestObject.date.getFullYear() === today.getFullYear()){
		return true
	}
	return false
	
}

//gibt true zurück wenn der letzte Eintrag einer Collection den übergebenen Wert bei dem übergebenen Attribut (name) hat
function checkCount(name, number, collection){
	var latestObject = collection.findOne({},{ sort:{ date:-1 } })
	if(latestObject[name] === number){
		return true
	}
	return false
}

//löscht den letzten Eintrag einer Collection
function removeLast(collection){
	collection.remove({date: collection.findOne({},{ sort:{ date:-1 } }).date})
}