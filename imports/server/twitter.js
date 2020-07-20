import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';
import { credentials } from '../api/access_Token.js';
let {PythonShell} = require('python-shell')

//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';
import { Posts } from '../api/twitter_posts.js';
import { Sentiment } from '../api/twitter_sentiment.js';
import { Accounts } from '../api/accounts.js';
import { RetweetCount } from '../api/twitter_retweetCount.js';
import { Dimensionen } from '../api/twitter_dimensionen.js';
import { Settings_DB } from '../api/settings.js';
import { Popular } from '../api/twitter_popular.js';
import { data } from 'jquery';
import { async } from 'rsvp';
import { Reddit_Dimensionen } from '../api/reddit_dimensionen.js';
import { Reddit_Hot } from '../api/reddit_hot.js';
import { Reddit_Karma } from '../api/reddit_karma.js';
import { Reddit_NewSubreddit } from '../api/reddit_newSubreddit.js';
import { Reddit_Popular } from '../api/reddit_popular.js';
import { Reddit_SubscriberCount } from '../api/reddit_subscriberCount.js';
import { Reddit_UserSubscriberCount } from '../api/reddit_userSubscriberCount.js';
import { Reddit_Posts } from '../api/reddit_posts.js';

var Twit = require('twit');	//https://github.com/ttezel/twit
var ml = require('ml-sentiment')({lang: 'de'});
const sm = require('sentimental');
const sw = require('stopword');
var GermanStemmer = require('snowball-stemmer.jsx/dest/german-stemmer.common.js').GermanStemmer;
const stem = new GermanStemmer();
const path = require('path');

Meteor.methods({

	async postTweet(text, dimension, user){
		var UserAPI = new Twit({
			consumer_key: credentials.key, // API key
			consumer_secret: credentials.token, // API secret
			access_token: Accounts.find({username: user}).fetch()[0].token,
			access_token_secret: Accounts.find({username: user}).fetch()[0].secret});

		let result = await UserAPI.post('statuses/update', { status: text});
		var id = result.data.id_str;
		var date = result.data.created_at;
		//speichert Post inklusive Dimension in Datenbank
		Posts.insert({
			id: id,
			date: new Date(date),
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
			twitter_auth: true,
			id: reply.user_id,
			screen_name: reply.screen_name
		  }});
		  return true
	},
	"updateServer": async() =>{
		let test = await getEverything()
		return test
	},
	updateSettings(name,q,w,e,r,t,z){
		Settings_DB.update({username: name},{$set:{
			p_d: q,
			e: w,
			a: e,
			f: r,
			v_f: t,
			g_v: z
		}})
		return false
	},
	async searchPosts(name,word){
		let posts = await TwitterAPI.get('search/tweets', { q: word, result_type: 'popular', lang: 'de', count: 3 });
		var array = [];
        var post = {text:"", autor:"", favorites:0, date:new Date(), link:""}
        for (var i= 0; i<posts.data.statuses.length; i++){
			if(posts.data.statuses[i].entities.urls[0]){
				post = {
					text: posts.data.statuses[i].text.replace(new RegExp(/https:\/\/.*/),""),
					autor: posts.data.statuses[i].user.name,
					favorites: posts.data.statuses[i].favorite_count,
					date: new Date(posts.data.statuses[i].created_at),
					link: posts.data.statuses[i].entities.urls[0].expanded_url
				}
			}else{
				post = {
					text: posts.data.statuses[i].text.replace(new RegExp(/https:\/\/.*/),""),
					autor: posts.data.statuses[i].user.name,
					favorites: posts.data.statuses[i].favorite_count,
					date: new Date(posts.data.statuses[i].created_at)
				}
				console.log(posts.data.statuses[i].entities)
			}
            array.push(post);
        }
		console.log(array)
		Popular.remove({username: name})
        Popular.insert({posts: array, username: name})
	}
});

//
//
//
//**Funktionen im Twitter Kontext**/
//
//
//


async function getDailyFollowers(){
	console.log("start followers")
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
	console.log("ende followers")
	return true
}

async function getPosts(){
	console.log("start posts")
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
						date: new Date(postArray[i].created_at),
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
	console.log("ende posts")
	return true	

	//console.log(Posts.find({retweet: false}).fetch());
}

async function getDimensions(){
	console.log("start Dimensionen")
	var dimensionsArray=["Emotionen","Produkt und Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","Gesellschaftliche Verantwortung"];
	var dimensionsArray02=["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"];
	var accounts = await Accounts.find({}).fetch();
	var l = accounts.length;
	for(var q=0;q<l;q++){
		if(accounts[q].twitter_auth){
			var name = accounts[q].username;
			var noValue = {
				favorites: 0,
				engagement: 0,
				replies: 0,
				retweets: 0,
				count: 0,
				s_neg: 0,
				s_neu: 0,
				s_pos:0,
				bestEngagement: "none"
			}
			var dimensionen = await Dimensionen.find({username:name}).fetch();
			if(!dimensionen[0]){
				Dimensionen.insert({
					Emotionen: noValue,
					Produkt_und_Dienstleistung: noValue,
					Arbeitsplatzumgebung: noValue,
					Finanzleistung: noValue,
					Vision_und_Führung: noValue,
					Gesellschaftliche_Verantwortung: noValue,
					username:name
				})
			}

			for (var i=0; i< 6; i++){
				var postInDimension = await Posts.find({username: name, dimension: dimensionsArray[i]}).fetch();
				var favorites = 0;
				var engagement = 0;
				var replies = 0;
				var retweets = 0;
				var count = 0;
				var s_neg= 0;
				var s_neu= 0;
				var s_pos= 0;
				var bestEngagement = "none";
				var bestEngagementScore = 0;

				if (postInDimension[0]){
					for (var k=0; k< postInDimension.length; k++){
						favorites += postInDimension[k].fav;
						engagement += postInDimension[k].engagement;
						replies += postInDimension[k].replies.length;
						retweets += postInDimension[k].retweets;
						count += 1;
						s_neg += postInDimension[k].s_neg;
						s_neu += postInDimension[k].s_neu;
						s_pos += postInDimension[k].s_pos;
						if (postInDimension[k].engagement>bestEngagementScore){
							bestEngagementScore = postInDimension[k].engagement;
							bestEngagement = postInDimension[k].id;
						}
					}
					len = postInDimension.length;
					favorites = favorites/len;
					engagement = engagement/len;
					replies = replies/len;
					retweets = retweets/len;
					s_gesamt = s_neg + s_neu + s_pos;
					if(s_gesamt>0){
						s_neg = s_neg/s_gesamt;
						s_neu = s_neu/s_gesamt;
						s_pos = s_pos/s_gesamt;
					}
					var value = {
						favorites: favorites,
						engagement: engagement,
						replies: replies,
						retweets: retweets,
						count: count,
						bestEngagement: bestEngagement,
						s_neg: s_neg,
						s_pos: s_pos,
						s_neu: s_neu
					}
					Dimensionen.update({username: name},{$set:{
						[dimensionsArray02[i]]: value
					}})
				}else{
					Dimensionen.update({username: name},{$set:{
						[dimensionsArray02[i]]: noValue
					}})
				}

			}
		}
	}
	console.log("ende Dimensionen")
	return true
}

async function getEngagement(){
	console.log("start Engagement")
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var i=0;i<len;i++){
		if(accounts[i].twitter_auth){
			var follower = FollowerCount.find({username: name}, { $sort:{ date: -1 }}).fetch()[0].count;
			if (follower<1){
				follower = 1
			}
			var name = accounts[i].username;
			console.log(name)
			var screen_name = accounts[i].screen_name;
			var act_replies = await getReplies(name);
			var act_favorites = await getFavorites(name);
			var act_retweets = await RetweetCount.find({username: name}, { $sort:{ date: -1 }}).fetch()[0].retweets;
			if (act_retweets<1){
				act_retweets = 1
			}
			console.log(act_replies)
			console.log(act_retweets)
			console.log(act_favorites)
			var act_gesamt = act_favorites + act_replies + act_retweets;
			var rel_replies = act_gesamt/act_replies;
			var rel_favorites = act_gesamt/act_favorites;
			var rel_retweets = act_gesamt/act_retweets;
			var rel_gesamt = rel_favorites + rel_replies + rel_retweets;
			rel_favorites = rel_favorites/rel_gesamt;
			rel_replies = rel_replies/rel_gesamt;
			rel_retweets = rel_retweets/rel_gesamt;
			console.log(rel_replies)
			console.log(rel_retweets)
			console.log(rel_favorites)
			var posts = Posts.find({username:name, retweet: false}).fetch();
			for(var j=0;j<posts.length;j++){
				var favorites = posts[j].fav;
				var replies = posts[j].replies.length;
				var retweets = posts[j].retweets;
				var engagement = (favorites*rel_favorites) + (replies*rel_replies) + (retweets*rel_retweets) / follower
				Posts.update({_id: posts[j]._id}, { $set:{ engagement : engagement } });

			}
		}
	}
	console.log("ende Engagement")
	return true
}

async function getReplies(nutzer){
	var posts = Posts.find({username: nutzer, retweet: false}).fetch();
	var replies = 0
	for(var j=0;j<posts.length;j++){
		replies += posts[j].replies.length;
	}
	if (replies<1){
		return 1
	}
	return replies
}

async function getFavorites(nutzer){
	var posts = Posts.find({username: nutzer}).fetch();
	var favs = 0
	for(var j=0;j<posts.length;j++){
		favs += posts[j].fav;
	}
	if (favs<1){
		return 1
	}
	return favs

}

async function postSentiment(){
	console.log("start PostSentiment")
	var accounts = Accounts.find({}).fetch();
	var l = accounts.length;
	for(var a=0;a<l;a++){
		if(accounts[a].twitter_auth){
			var name = accounts[a].username;
			var screen_name = accounts[a].screen_name;
			var UserAPI = new Twit({
				consumer_key: credentials.key, // API key
				consumer_secret: credentials.token, // API secret
				access_token: Accounts.find({username: name}).fetch()[0].token,
				access_token_secret: Accounts.find({username: name}).fetch()[0].secret});
			//API Anfrage nach alles Mentions(@)
			let result = await UserAPI.get('statuses/mentions_timeline', { screen_name: screen_name});
			var mentionArray = result.data;
			for (i=0; i<mentionArray.length-1; i++){
				var mentionInReply = Posts.find({id: mentionArray[i].in_reply_to_status_id_str}).fetch();
				var replyList = [];
				if (mentionInReply[0]){
					//wenn noch keine Antworten für diesen Post eingetragen sind, dann Feld durch leere Liste initialisieren
					replyList = mentionInReply[0].replies
					//Wenn der aktuelle Text noch nicht in der Datenbank eingetragen ist, diesen an die lokale Liste anhängen
					var replyExists = replyList.includes(mentionArray[i].text);
					if(!replyExists){
						replyList.push(mentionArray[i].text)
					}
					//Die lokale Liste wieder in der Datenbank speichern
					Posts.update({id: mentionArray[i].in_reply_to_status_id_str},{$set: {replies: replyList}})
					var mention = Mentions.find({id01: mentionArray[i].id}).fetch()
					if(mention[0]){
						if (!replyExists && mention[0].sentiment>0){
							Posts.update({id: mentionArray[i].in_reply_to_status_id_str}, {$inc:{s_pos: 1}})
						}
						if (!replyExists && mention[0].sentiment===0){
							Posts.update({id: mentionArray[i].in_reply_to_status_id_str}, {$inc:{s_neu: 1}})
						}
						if (!replyExists && mention[0].sentiment<0){
							Posts.update({id: mentionArray[i].in_reply_to_status_id_str}, {$inc:{s_neg: 1}})
						}
					}
				}

			}
		}
	}
	console.log("ende PostSentiment")
	return true
}

async function getRetweets(){
	console.log("start Retweets")
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
	console.log("ende Retweets")
	return true
}

async function getMentions(){

	console.log("start Mentions")

	var accounts = Accounts.find({}).fetch();
	var l = accounts.length;
	for(var a=0;a<l;a++){
		if(accounts[a].twitter_auth){
			var name = accounts[a].username;
			var screen_name = accounts[a].screen_name;
			var UserAPI = new Twit({
				consumer_key: credentials.key, // API key
				consumer_secret: credentials.token, // API secret
				access_token: Accounts.find({username: name}).fetch()[0].token,
				access_token_secret: Accounts.find({username: name}).fetch()[0].secret});
			//API Anfrage nach alles Mentions(@)
			let result = await UserAPI.get('statuses/mentions_timeline', { screen_name: screen_name});
			var mentionArray = result.data;
			//Anzahl der Autoren initialisieren
			var authorCount = 0
			var count = 0
			var oldData = MentionCount.find({username: name}, {sort:{date:-1}}).fetch()[0]
			if (oldData){
				authorCount = oldData.authors
				count = oldData.mentions
			}

			//Iteration durch alle Mentions
			for (i=0; i<mentionArray.length-1; i++){
				var mentionExists = Mentions.find({id02:mentionArray[i].id_str, username:name}).fetch()
				if(!mentionExists[0]){
					count ++
					//Wenn der Autor der aktuellen Mention noch nicht in der Collection vorkommt, Anzahl der Autoren erhöhen
					var author = await Mentions.find({author: mentionArray[i].user.name, username: name}).fetch();
					if(!author[0]){
						authorCount ++
					}
					//Erstellt einen Eintrag für die Mention in der Collection für die Inahlte der Mentions

					await Mentions.insert({
						date: new Date(mentionArray[i].created_at),
						id01: mentionArray[i].id,
						id02: mentionArray[i].id_str,
						content: mentionArray[i].text,
						author: mentionArray[i].user.name,
						username: name
					})

				}

			}

			//Eintrag in die Collection für die Anzahl der Mentions und Autoren
			//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
			if(MentionCount.find({username: name}).count()>0){

				//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
				if (!checkDaily(MentionCount, name) || (checkDaily(MentionCount, name) && (!checkCount("mentions", count, MentionCount, name) || !checkCount("authors", authorCount, MentionCount, name)))){

					//letzten Eintrag löschen, wenn zweiter Fall zutrifft
					if(checkDaily(MentionCount, name)){
						removeLast(MentionCount, name)
					}
					MentionCount.insert({date: new Date(), mentions: count, authors: authorCount, username: name})
				}
			}else{
				MentionCount.insert({date: new Date(), mentions: count, authors: authorCount, username: name})
			}
		}
	}
	console.log("ende Mentions")
	return true
}

async function getEverything(){
	let a1 = await getDailyFollowers();
	let a2 = await getPosts();
	let a3 = await getMentions();
	let a4 = await getRetweets();
	let a5 = await python();
	let a6 = await postSentiment();
	let a7 = await getEngagement();
	let a8 = await getDimensions();	
	return true
}

//
//
//
//**Exportierte Funktionen**
//
//
//

export async function initial(){
	//getEverything();
	//var myVar = setInterval(getEverything, 1200000);
	/*Posts.update({text:"Testtweet"}, {$set:{dimension:"Produkt und Dienstleistung"}})
	Posts.update({text:"heute ist meine Stimmung deutlich besser!"}, {$set:{dimension:"Arbeitsplatzumgebung"}})
	Posts.update({text:"Hier ist was los"}, {$set:{dimension:"Arbeitsplatzumgebung"}})
	Posts.update({text:"ich bin sehr traurig."}, {$set:{dimension:"Vision und Führung"}})
	Posts.update({text:"asdf"}, {$set:{dimension:"Finanzleistung"}})
	Posts.update({text:"sehr umweltbewusst"}, {$set:{dimension:"Gesellschaftliche Verantwortung"}})
	Posts.update({text:"qwertz"}, {$set:{dimension:"Vision und Führung"}})
	Posts.update({text:"Ist das hier jetzt fertig?"}, {$set:{dimension:"Produkt und Dienstleistung"}})
	Posts.update({text:"hahahaha"}, {$set:{dimension:"Vision und Führung"}})
	Posts.update({text:"sdfgsdfgsdfg"}, {$set:{dimension:"Gesellschaftliche Verantwortung"}})*/
	

}



//
//
//
//**allgemeine Funktionen**
//
//
//

//Python Datei ausführen dafür immer den absoluten Pfad der Python Datei angeben
async function python(){
	console.log("start Sentiment")
	const { success, err = '', results } = await new Promise((resolve, reject) => {
    PythonShell.run("/"+path.relative('/', '../../../../../imports/server/sentiment.py'), null, function(
		err,
		results
	  ) {
		if (err) {
		  logger.error(err, '[ config - runManufacturingTest() ]');
		  reject({ success: false, err });
		}
		resolve({ success: true, results });
	  });
	})
	console.log("ende Sentiment")
	return true
	
}

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
