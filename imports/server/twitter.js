import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';

//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';
import { Posts } from '../api/twitter_posts.js';

var Twit = require('twit');	//https://github.com/ttezel/twit

Meteor.methods({

	//Methode, um etwas auf Twitter zu posten
	async postTweet(text, dimension){
		/*let result = await TwitterAPI.post('statuses/update', { status: text});
		var id = result.data.id_str;
		var date = result.data.created_at;
		//speichert Post inklusive Dimension in Datenbank
		Posts.insert({id: id, date: date, text: text, dimension: dimension, retweet: false});*/
		console.log(text);
		console.log(dimension);
	}
});

//
//
//
//**Funktionen im Twitter Kontext**/
//
//
//

//Aktualisiert die Favorites und Retweets der eigenen Posts
async function getPosts(){
	let result = await TwitterAPI.get('statuses/user_timeline', { screen_name:"@FlorianKindler", count:50 });
	var postArray = result.data;
	
	//Iteration durch alle Posts
	for (i=0; i<postArray.length;i++){
		//Array mit Collection-Einträgen mit identischer ID (entweder leer oder ein Element, wenn Posts bereits in Datenbank)
		var idChecked = Posts.find({id: postArray[i].id_str}).fetch();
		//True wenn Posts ein Retweet ist
		var retweetChecked = postArray[i].retweeted;
		if(idChecked[0]){
			//Aktualisiert Favorites und Retweets, wenn Posts bereits in Datenbank existiert
			Posts.update({id: postArray[i].id_str}, {$set:{fav: postArray[i].favorite_count, retweets: postArray[i].retweet_count}})
		}else{
			//erstellt Eintrag, wenn Post noch nicht existiert
			Posts.insert({
				id: postArray[i].id_str,
				date: postArray[i].created_at,
				text: postArray[i].text,
				dimension: "not defined",
				fav: postArray[i].favorite_count,
				retweets: postArray[i].retweet_count,
				retweet: retweetChecked
			})
		}
		
	}
	//console.log(Posts.find({retweet: false}).fetch());
	getMentions();
}



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




//Aktualisiert oder speichert die Anzahl der Mentions, die Anzahl der Autoren, den Inhalt der Mentions und die Antorten der eigenen Posts
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

		//Abschnitt, um Antowrten zu Posts zuzuordnen
		//true, wenn in der Posts Collection ein Eintrag besteht, zu dem die aktuelle Mention eine Antwort ist
		var mentionInReply = Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch();
		var replyList = [];
		if (mentionInReply[0]){
			//wenn noch keine Antworten für diesen Post eingetragen sind, dann Feld durch leere Liste initialisieren
			if(!Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch()[0].replies){
				Posts.update({id: mentionArray[i].in_reply_to_status_id_str}, {$push: {replies:[]}})
			}else{
				//ansonsten lokale Liste durch die in der Datenbank ersetzen
				replyList = Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch()[0].replies
			}
			//Wenn der aktuelle Text noch nicht in der Datenbank eingetragen ist, diesen an die lokale Liste anhängen
			var replyExists = Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch()[0].replies.includes(mentionArray[i].text);
			if(!replyExists){
				replyList.push(mentionArray[i].text)
			}
			//Die lokale Liste wieder in der Datenbank speichern
			Posts.update({id: mentionArray[i].in_reply_to_status_id_str},{$set: {replies: replyList}})
		}

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
		if (!checkDaily(MentionCount) || (checkDaily(MentionCount) && (!checkCount("mentions", mentions, MentionCount) || !checkCount("authors", authorCount, MentionCount)))){
			
			//letzten Eintrag löschen, wenn zweiter Fall zutrifft
			if(checkDaily(MentionCount)){
				removeLast(MentionCount)
			}
			MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount})
		}
	}else{
		MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount})
	}
	console.log(Mentions.find({}).fetch())
	console.log(MentionCount.find({}).fetch())
	console.log(Posts.find({retweet: false}).fetch());
}

//
//
//
//**Exportierte Funktionen**
//
//
//

export function initial(){
	getDailyFollowers();
	//getMentions();
	getPosts();
	var myVar = setInterval(getDailyFollowers, 1200000);
	//var myVar02 = setInterval(getMentions, 1200000);
	var myVar03 = setInterval(getPosts, 1200000);
}

//
//
//
//**allgemeine Funktionen**
//
//
//

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