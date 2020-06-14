import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';

//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';
import { Posts } from '../api/twitter_posts.js';
import { Sentiment } from '../api/twitter_sentiment.js';
import { Accounts } from '../api/accounts.js';
import { RetweetCount } from '../api/twitter_retweetCount.js';

var Twit = require('twit');	//https://github.com/ttezel/twit
var ml = require('ml-sentiment')({lang: 'de'});
const sm = require('sentimental');
const sw = require('stopword');
var GermanStemmer = require('snowball-stemmer.jsx/dest/german-stemmer.common.js').GermanStemmer;
const stem = new GermanStemmer();


/*var TwitterAPI = new Twit({
	consumer_key: "yCR61JPigbhs8tQUDMjy1Bgz3", // API key
	consumer_secret: "ltkN0xgHBeUX9i3mF1fYIQAgsTNYMUc4H6ZyM7sXEvtgVt9JhT", // API secret
	access_token: Accounts.find({username: Meteor.user().username}).fetch()[0].token,
	access_token_secret: Accounts.find({username: Meteor.user().username}).fetch()[0].secret});*/
	

Meteor.methods({

	//Methode, um etwas auf Twitter zu posten
	async postTweet(text, dimension, user){
		var UserAPI = new Twit({
			consumer_key: "yCR61JPigbhs8tQUDMjy1Bgz3", // API key
			consumer_secret: "ltkN0xgHBeUX9i3mF1fYIQAgsTNYMUc4H6ZyM7sXEvtgVt9JhT", // API secret
			access_token: Accounts.find({username: user}).fetch()[0].token,
			access_token_secret: Accounts.find({username: user}).fetch()[0].secret});
			
		let result = await UserAPI.post('statuses/update', { status: text});
		var id = result.data.id_str;
		var date = result.data.created_at;
		//speichert Post inklusive Dimension in Datenbank
		console.log(dimension)
		Posts.insert({
			id: id, 
			date: date, 
			text: text, 
			dimension: dimension, 
			retweet: false, 
			replies: [],
			s_neg: 0,
			s_neu: 0,
			s_pos: 0,
			username: user
		});
	},
	updateTwitterAuth(reply){
		Accounts.update({username: Meteor.user().username},{$set:{
			token: reply.oauth_token,
			secret: reply.oauth_token_secret,
			id: reply.user_id,
			screen_name: reply.screen_name
		  }});
	},
	updateServer(){
		getDailyFollowers();
		getPosts();
	}
});

//
//
//
//**Funktionen im Twitter Kontext**/
//
//
//

//Ergänzt einen neuen Eintrag für die Followerzahlen, wenn heute noch kein Eintrag gemacht wurde oder der Wert von den bisherigen abweicht
async function getDailyFollowers(){
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var i=0;i<len;i++){
		if(accounts[i].twitter_auth){
			var follower = []
			var name = accounts[i].username;
			var screen_name = accounts[i].screen_name;
			//API Anfrage nach Liste der Follower
			let result = await TwitterAPI.get('followers/ids', { screen_name: screen_name});
			follower = result.data.ids.length;
			
			//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
			if (FollowerCount.find({username: name}).count()>0){
				
				//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
				if (!checkDaily(FollowerCount, name) || (!checkCount("count", follower, FollowerCount, name) && checkDaily(FollowerCount, name))){
					//letzten Eintrag löschen, wenn zweiter Fall zutrifft
					if(!checkCount("count", follower, FollowerCount, name) && checkDaily(FollowerCount, name)){
						removeLast(FollowerCount, name)
					}
					FollowerCount.insert({count: follower, date: new Date(), username: name});
				}
			}else{
				FollowerCount.insert({count: follower, date: new Date(), username: name});
			}
		}
	}
	console.log(FollowerCount.find({}).fetch())
}


//Aktualisiert die Favorites und Retweets der eigenen Posts
async function getPosts(){
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var a=0;a<len;a++){
		if(accounts[a].twitter_auth){
			var name = accounts[a].username;
			var screen_name = accounts[a].screen_name;
			let result = await TwitterAPI.get('statuses/user_timeline', { screen_name: screen_name, count:500 });
			var postArray = result.data;
			
			//Iteration durch alle Posts
			for (i=0; i<postArray.length;i++){
				//Array mit Collection-Einträgen mit identischer ID (entweder leer oder ein Element, wenn Posts bereits in Datenbank)
				var idChecked = Posts.find({id: postArray[i].id_str}).fetch();
				//True wenn Posts ein Retweet ist
				var retweetChecked = postArray[i].retweeted;
				var rt = postArray[i].text.slice(0,2);
				if(rt == "RT"){
					retweetChecked = true
				}
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
						retweet: retweetChecked,
						replies: [],
						s_neg: 0,
						s_neu: 0,
						s_pos: 0,
						username: name
					})
				}
				
			}
		}
	}
	//console.log(Posts.find({retweet: false}).fetch());
	getMentions();
	getRetweets();
}


function postSentiment(){
	Posts.update({},{$set: {s_neg: 0, s_neu: 0, s_pos:0}})
	var postArray = Posts.find({retweet: false}).fetch();
	for(var post=0; post<postArray.length; post++){
		replyArray = postArray[post].replies;
		for (var reply=0; reply<replyArray.length; reply++){
			var sentiment = sm('DE', replyArray[reply]);
			var sentiment02 = ml.classify(replyArray[reply]);
			if (sentiment<0 || sentiment02<0){ Posts.update({id: postArray[post].id},{$inc: {s_neg: 1}}) }
			if (sentiment===0 && sentiment02===0){ Posts.update({id: postArray[post].id},{$inc: {s_neu: 1}}) }
			if (sentiment>0 || sentiment02>0){ Posts.update({id: postArray[post].id},{$inc: {s_pos: 1}}) }
		}
	}
}

function mentionSentiment(string){
	/*var oldString = string.split(' ')
	var newString = sw.removeStopwords(oldString, sw.de)
	var text = ""
	for(x=0; x<newString.length; x++){
		//newString[x] = stem.stemWord(newString[x]);
		text = text + " " + newString[x];
	}*/
	var text = string;
	var sentiment = sm('DE', text);
	var sentiment02 = ml.classify(text);
	console.log(text);
	console.log(sentiment);
	console.log(sentiment02);
	if (sentiment<0 || sentiment02<0){ Sentiment.update({},{$inc: {s_neg: 1}}) }
	if (sentiment===0 && sentiment02===0){ Sentiment.update({},{$inc: {s_neu: 1}}) }
	if (sentiment>0 || sentiment02>0){ Sentiment.update({},{$inc: {s_pos: 1}}) }

}

function initSentiment(){
	if (!Sentiment.find({}).fetch()[0]){
		Sentiment.insert({s_neg: 0, s_neu: 0, s_pos:0})
	}
	Sentiment.update({},{s_neg: 0, s_neu: 0, s_pos:0})
}

function getRetweets(){
	var accounts = Accounts.find({}).fetch();
	var l = accounts.length;
	for(var k=0;k<l;k++){
		if(accounts[k].twitter_auth){
			
			var name = accounts[k].username;
			var screen_name = accounts[k].screen_name;
			var posts = Posts.find({retweet: false, username: name}).fetch();
			var len = posts.length;
			var retweets = 0;
			for(i=0; i<len; i++){
				retweets += posts[i].retweets;
			}
			//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
			if (RetweetCount.find({username: name}).count()>0){
						
				//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
				if (!checkDaily(RetweetCount, name) || (!checkCount("retweets", retweets, RetweetCount, name) && checkDaily(RetweetCount, name))){
					//letzten Eintrag löschen, wenn zweiter Fall zutrifft
					if(!checkCount("retweets", retweets, RetweetCount, name) && checkDaily(RetweetCount, name)){
						removeLast(RetweetCount, name)
					}
					RetweetCount.insert({retweets: retweets, date: new Date(), username: name});
				}
			}else{
				RetweetCount.insert({retweets: retweets, date: new Date(), username: name});
			}
		}
	}
	//console.log(RetweetCount.find({}).fetch())
}

//Aktualisiert oder speichert die Anzahl der Mentions, die Anzahl der Autoren, den Inhalt der Mentions und die Antorten der eigenen Posts
async function getMentions(){
	
	Mentions.remove({});
	initSentiment();
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var a=0;a<len;a++){
		if(accounts[a].twitter_auth){
			var name = accounts[a].username;
			var screen_name = accounts[a].screen_name;
			var UserAPI = new Twit({
				consumer_key: "yCR61JPigbhs8tQUDMjy1Bgz3", // API key
				consumer_secret: "ltkN0xgHBeUX9i3mF1fYIQAgsTNYMUc4H6ZyM7sXEvtgVt9JhT", // API secret
				access_token: Accounts.find({username: name}).fetch()[0].token,
				access_token_secret: Accounts.find({username: name}).fetch()[0].secret});
			//API Anfrage nach alles Mentions(@)	
			let result = await UserAPI.get('statuses/mentions_timeline', { screen_name: screen_name});	
			var mentionArray = result.data;
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
					replyList = Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch()[0].replies
					//Wenn der aktuelle Text noch nicht in der Datenbank eingetragen ist, diesen an die lokale Liste anhängen
					var replyExists = Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch()[0].replies.includes(mentionArray[i].text);
					if(!replyExists){
						replyList.push(mentionArray[i].text)
					}
					//Die lokale Liste wieder in der Datenbank speichern
					Posts.update({id: mentionArray[i].in_reply_to_status_id_str},{$set: {replies: replyList}})
				}

				//Wenn der Autor der aktuellen Mention noch nicht in der Collection vorkommt, Anzahl der Autoren erhöhen
				var author = Mentions.find({author: mentionArray[i].user.name, username: name}).fetch();
				if(!author[0]){
					authorCount ++
				}

				//Erstellt einen Eintrag für die Mention in der Collection für die Inahlte der Mentions
				Mentions.insert({
					date: mentionArray[i].created_at,
					id01: mentionArray[i].id,
					id02: mentionArray[i].id_str,
					content: mentionArray[i].text,
					author: mentionArray[i].user.name,
					username: name
				})

			
				//mentionSentiment(mentionArray[i].text);

			}

			//postSentiment();
			//Eintrag in die Collection für die Anzahl der Mentions und Autoren
			//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
			if(MentionCount.find({username: name}).count()>0){

				//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
				if (!checkDaily(MentionCount, name) || (checkDaily(MentionCount, name) && (!checkCount("mentions", mentions, MentionCount, name) || !checkCount("authors", authorCount, MentionCount, name)))){
					
					//letzten Eintrag löschen, wenn zweiter Fall zutrifft
					if(checkDaily(MentionCount, name)){
						removeLast(MentionCount, name)
					}
					MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount, username: name})
				}
			}else{
				MentionCount.insert({date: new Date(), mentions: mentions, authors: authorCount, username: name})
			}
		}
	}
	//console.log(Mentions.find({}).fetch())
	//console.log(MentionCount.find({}).fetch())
	//console.log(Posts.find({retweet: false}).fetch());
	//console.log(Sentiment.find({}).fetch())
}

//
//
//
//**Exportierte Funktionen**
//
//
//

export function initial(){
	/*Posts.remove({});
	getDailyFollowers();
	getPosts();
	var myVar = setInterval(getDailyFollowers, 1200000);
	var myVar03 = setInterval(getPosts, 1200000);*/
	getDailyFollowers();
	getPosts();
}

//
//
//
//**allgemeine Funktionen**
//
//
//

//gibt true zurück wenn Collection bereits einen Eintrag mit heutigem Datum enthält 
function checkDaily(collection, name){
	var today = new Date();
	var latestObject = collection.findOne({username: name},{ sort:{ date:-1 } })
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
function checkCount(name, number, collection, user){
	var latestObject = collection.findOne({username: user},{ sort:{ date:-1 } })
	if(latestObject[name] === number){
		return true
	}
	return false
}

//löscht den letzten Eintrag einer Collection
function removeLast(collection, name){
	collection.remove({date: collection.findOne({username: name},{ sort:{ date:-1 } }).date})
}
