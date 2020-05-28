import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';

//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';

var Twit = require('twit');	//https://github.com/ttezel/twit



//**Funktionen im Twitter Kontext**/

//Ergänzt einen neuen Eintrag für die Followerzahlen, wenn heute noch kein Eintrag gemacht wurde oder der Wert von den bisherigen abweicht
async function getDailyFollowers(){
	var follower = []

	//API Anfrage nach Liste der Follower
	let result = await TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"});
	follower = result.data.ids.length;
	
	//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
	if (FollowerCount.find({}).count()>0){
		
		//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
		if (!checkDaily(FollowerCount) || (!checkCount("count", follower, FollowerCount) && checkDaily(FollowerCount))){
			
			//letzten Eintrag löschen, wenn zweiter Fall zutrifft
			if(!checkCount("count", follower, FollowerCount) && checkDaily(FollowerCount)){
				removeLast(FollowerCount)
			}
			FollowerCount.insert({count: follower, date: new Date()});
		}
	}else{
		FollowerCount.insert({count: follower, date: new Date()});
	}
	console.log(FollowerCount.find({}).fetch())
}




//Funktion für den Abruf und zur Berechnung der @-Erwähnungen durch andere Benutzer
async function getMentions(){

	Mentions.remove({});

	//API Anfrage nach alles Mentions(@)	
	let result = await TwitterAPI.get('statuses/mentions_timeline', { screen_name:"@FlorianKindler"});	
	mentionArray = result.data;
	var mentions = mentionArray.length;

	//Anzahl der Autoren initialisieren
	var authorCount = 0

	//Iteration durch alle Mentions
	for (i=0; i<mentionArray.length; i++){

		//Wenn der Autor der aktuellen Mention noch nicht in der Collection vorkommt, Anzahl der Autoren erhöhen
		var author = Mentions.find({author: mentionArray[i].user.name}).fetch();
		if(!author[0]){
			authorCount ++
		}

		//Erstellt einen Eintrag für die Mention in der Collection für die Inahlte der Mentions
		Mentions.insert({
			date: mentionArray[i].created_at,
			id01: mentionArray[i].id,
			id02: mentionArray[i].id_str,
			content: mentionArray[i].text,
			author: mentionArray[i].user.name
		})

	}

	//Eintrag in die Collection für die Anzahl der Mentions und Autoren
	//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
	if(MentionCount.find({}).count()>0){

		//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
		if (!checkDaily(MentionCount) || (!checkCount("mentions", mentions, MentionCount) && checkDaily(MentionCount))){

			//letzten Eintrag löschen, wenn zweiter Fall zutrifft
			if(!checkCount("mentions", mentions, MentionCount)){
				removeLast(MentionCount)
			}
			MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount})
		}
	}else{
		MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount})
	}
	console.log(Mentions.find({}).fetch())
	console.log(MentionCount.find({}).fetch())
}


export function initial(){
	getDailyFollowers();
	getMentions();
	var myVar = setInterval(getDailyFollowers, 1200000);
	var myVar02 = setInterval(getMentions, 1200000);
}


//**allgemeine Funktionen**

//gibt true zurück wenn Collection bereits einen Eintrag mit heutigem Datum enthält 
function checkDaily(collection){
	var today = new Date();
	var latestObject = collection.findOne({},{ sort:{ date:-1 } })
	if(checkDate(today, latestObject.date)){
		return true
	}
	return false
	
}

function checkDate(date1, date2){
	if(date1.getDay() === date2.getDay() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()){
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