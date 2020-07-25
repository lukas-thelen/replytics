import { Meteor } from 'meteor/meteor';
import { RedditContent } from 'snoowrap';

import { Accounts } from '../api/accounts.js';
import { Reddit_SubscriberCount } from '../api/reddit_subscriberCount.js';
import { Reddit_Posts } from '../api/reddit_posts.js';
import { Reddit_Hot } from '../api/reddit_hot.js';
import { Reddit_NewSubreddit } from '../api/reddit_newSubreddit.js';
import { Reddit_Dimensionen } from '../api/reddit_dimensionen.js';
import { unstable_batchedUpdates } from 'react-dom';
import { Reddit_UserSubscriberCount } from '../api/reddit_userSubscriberCount.js';
import { Reddit_Karma } from '../api/reddit_karma.js';
import {Reddit_Popular} from '../api/reddit_popular.js';
import { Posts } from '../api/twitter_posts.js';
import { TwitterAPI } from '../api/twitter_credentials.js';

let {PythonShell} = require('python-shell')
const path = require('path');


//import { TwitterAPI } from '../api/twitter_credentials.js';

var snoowrap = require('snoowrap');

//Reddit API Daten
const red = new snoowrap({
    userAgent: 'replytics for web v0 (by u/replytics)',
    clientId: 'E6ul0OQ6hTnePQ',
    clientSecret: '--2tzGInEmSscmccd32ozQjf-wE',
    refreshToken: '553271810001-VLKWIbnsuaBvJBV5rskKFI7ZjLA'
});


//Anfrage des Request Tokens von Reddit
Meteor.methods({
    async reddit_requester(name, code){
        console.log(code)
        let test02 = test.bind(this);
		snoowrap.fromAuthCode({
            code: code,
            userAgent: 'replytics for web v0 (by u/replytics)',
            clientId: 'E6ul0OQ6hTnePQ',
            clientSecret: '--2tzGInEmSscmccd32ozQjf-wE',
            redirectUri: 'http://localhost:3000',
            refreshToken: '553271810001-VLKWIbnsuaBvJBV5rskKFI7ZjLA'
          }).then(r => {
            return test02(r, name)
        })
    },
    async reddit_code(name, code){
        let test = await Accounts.update({username:name}, {$set:{reddit_auth: true, reddit_code:code}})
        return true
    },
    async update_reddit(sub, name, user){
        let wait01 = await Accounts.update({username:user}, {$set:{sub:sub, r_name: name}})
        let wait = await getEverything();
        return false
    },
    async reddit_posten(name, title, text, dimension){
        let r = await Accounts.find({username:name}).fetch()[0].requester
        reddit = new snoowrap(r)
        let sub = await Accounts.find({username:name}).fetch()[0].sub
        let result = await reddit.submitSelfpost({
            subredditName:sub,
            title: title,
            text: text
        }).fetch()
	//Abspeicherung der Accountdaten in der Meteordatenbank
        Reddit_Posts.insert({
			id: result.id, 
			date: new Date(result.created_utc*1000), 
            text: title,
            dimension: dimension,
            ups: 0,
            downs: 0,
            num_replies: 0,
            replies: [],
            s_neg: 0,
            s_neu: 0,
            s_pos: 0,
            username: name			
		});
		getEverything();
	},
	//Abfrage von Redditbeiträgen zu einem Suchbegriff
	async searchReddit(suchbegriff, name){
		console.log(suchbegriff)
		console.log(name)
		let posts = await red.search({query: suchbegriff, time: 'week', sort: 'top', limit:3});
		console.log(posts);
		var array =[]
		var post = {text:"", autor:"", ups:0, downs:0, subreddit:"", date:new Date(), link:""}
        for (var i= 0; i<posts.length; i++){
				post = {
					text: posts[i].title,
					autor: posts[i].author.name,
					ups: posts[i].ups,
					downs: posts[i].downs,
					subreddit: posts[i].subreddit.display_name,
					date: new Date(posts[i].created_utc*1000),
					link: posts[i].url
				}
            array.push(post);
        }
		console.log(array)
		Reddit_Popular.remove({username: name})
        Reddit_Popular.insert({posts: array, username: name})
	},
	async update_reddit_server (){
		let wait = await getEverything();
		return true
	}
})


async function test(r, name){
    Accounts.update({username:name}, {$set:{requester:r, reddit_auth: true}})
}
//Funktion um den täglichen Subscribers Stand abzufragen und zu speichern
async function getDailySubscribers(){
	console.log("anfang subs")
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var i=0;i<len;i++){
		if(accounts[i].sub && accounts[i].sub!=""){
			var name = accounts[i].username;
			var sub = accounts[i].sub;
			//API Anfrage nach Liste der Follower
			let result = await red.getSubreddit(sub).fetch()
			subs = result.subscribers
			
			//nur wenn Collection nicht leer ist, diese vor dem neuen Eintrag überprüfen
			if (Reddit_SubscriberCount.find({username: name}).count()>0){
				
				//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
				if (!checkDaily(Reddit_SubscriberCount, name) || (!checkCount("subscriber", subs, Reddit_SubscriberCount, name) && checkDaily(Reddit_SubscriberCount, name))){
					//letzten Eintrag löschen, wenn zweiter Fall zutrifft
					if(!checkCount("subscriber", subs, Reddit_SubscriberCount, name) && checkDaily(Reddit_SubscriberCount, name)){
						removeLast(Reddit_SubscriberCount, name)
					}
					Reddit_SubscriberCount.insert({subscriber: subs, date: new Date(), username: name, subreddit: sub});
				}
			}else{
				Reddit_SubscriberCount.insert({subscriber: subs, date: new Date(), username: name, subreddit: sub});
			}
		}
	}
	console.log("ende subs")
    return true
}

//Abrufen der Beiträge vom Nutzer
async function getPosts(){
	console.log("anfang posts")
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var a=0;a<len;a++){
		if(accounts[a].r_name){
			var name = accounts[a].username;
			var reddit_name = accounts[a].r_name;
            let postArray = await red.getUser(reddit_name).getSubmissions()
            
			//Iteration durch alle Posts
			for (i=0; i<postArray.length;i++){
                let x = await postArray[i].comments.fetchAll()
                replies = []
                for(var z=0; z<x.length; z++){
                   replies.push(x[z].body)
				}
				//Array mit Collection-Einträgen mit identischer ID (entweder leer oder ein Element, wenn Posts bereits in Datenbank)
				var idChecked = Reddit_Posts.find({id: postArray[i].id}).fetch();
				var downs = Math.round(Math.max(postArray[i].ups,1)/postArray[i].upvote_ratio)-Math.max(postArray[i].ups,1)
				if(idChecked[0]){
					//Aktualisiert Favorites und Retweets, wenn Posts bereits in Datenbank existiert
					let test01 = await Reddit_Posts.update({id: postArray[i].id}, {$set:{
                        ups: postArray[i].ups,
                        downs: downs,
                        num_replies: postArray[i].num_comments,
                        replies: replies,
                    }})
				}else{
					//erstellt Eintrag, wenn Post noch nicht existiert
					let test = await Reddit_Posts.insert({
						id: postArray[i].id,
						date: new Date(postArray[i].created_utc*1000),
						text: postArray[i].title,
						dimension: "not defined",
						ups: postArray[i].ups,
                        downs: downs,
                        num_replies: postArray[i].num_comments,
						replies: replies,
						s_neg: 0,
						s_neu: 0,
						s_pos: 0,
						username: name
					})
				}
				
			}
		}
    }
    console.log("ende posts")
    return true
    
}

//Verknüpfung mit dem Python Script um den Sentiment der Beiträge zu berechnen
async function getPostSentiment(){
	console.log("anfang Postsentiment")
	const { success, err = '', results } = await new Promise((resolve, reject) => {
    	PythonShell.run("/"+path.relative('/', '../../../../../imports/server/reddit_postsentiment.py'), null, function(
			err,
			results
		  ) {
			if (err) {
			  logger.error(err, '[ config - runManufacturingTest() ]');
			  reject({ success: false, err });
			}
			console.log("mitte Postsentiment")
			resolve({ success: true, results });
		  });
		})
		console.log("ende Postsentiment")
    return true
}

//Aufrufen der Erwähnungen/Mentions des Nutzer und der entsprechenden Sentimentberechnung durch das Python Script
async function getSentiment(){
	console.log("anfang sentiment")
    var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var a=0;a<len;a++){
		if(accounts[a].sub && accounts[a].sub!=""){
            var name = accounts[a].username;
            var sub = accounts[a].sub;
            posts =[]
            let result = await red.getNew(sub, {limit:20})
            for(var t=0; t<result.length; t++){
                posts.push(result[t].title)
            }
            Reddit_NewSubreddit.remove({username: name})
            Reddit_NewSubreddit.insert({username:name, posts:posts, s_pos:0, s_neg:0, s_neu:0, s_pos_p:0, s_neg_p:0, s_neu_p:0, s_average:0})
        }
	}
	const { success, err = '', results } = await new Promise((resolve, reject) => {
		PythonShell.run("/"+path.relative('/', '../../../../../imports/server/reddit_sentiment.py'), null, function(
			err,
			results
		  ) {
			if (err) {
			  console.log(err);
			  reject({ success: false, err });
			}
			console.log("mitte sentiment")
			resolve({ success: true, results });
		  });
		})
		console.log("ende Sentiment")
		return true
}


//berechnet für jeden Beitrag das Engagement und speichert es mit dem Posts zusammen ab
async function getEngagement(){
	console.log("anfang engagement")
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var i=0;i<len;i++){
		if(accounts[i].sub /* reddit_auth */){
			var name= accounts[i].name
			var sub = accounts[i].sub
            var subscriber = Reddit_UserSubscriberCount.find({username: name, subreddit: sub}, { $sort:{ date: -1 }}).fetch();
            if (subscriber[0]){
                subscriber = subscriber[0].subscriber
            }else{
                subscriber = 1
            }
			if (subscriber<1){
				subscriber = 1
			}
			var name = accounts[i].username;
			var act_replies = await getReplies(name);
            var act_ups = await getUps(name);
			var act_downs = await getDowns(name);
			var act_gesamt = act_ups + act_replies + act_downs;
			var rel_replies = act_gesamt/act_replies;
			var rel_ups = act_gesamt/act_ups;
			var rel_downs = act_gesamt/act_downs;
			var rel_gesamt = rel_ups + rel_replies + rel_downs;
			rel_ups = rel_ups/rel_gesamt;
			rel_replies = rel_replies/rel_gesamt;
			rel_downs = rel_downs/rel_gesamt;
			var posts = Reddit_Posts.find({username:name}).fetch();
			for(var j=0;j<posts.length;j++){
				var ups = posts[j].ups;
				var replies = posts[j].num_replies;
				var downs = posts[j].downs;
				var engagement = ((ups*rel_ups) + (replies*rel_replies) + (downs*rel_downs)) / subscriber
				Reddit_Posts.update({_id: posts[j]._id}, { $set:{ engagement : engagement } });

			}
		}
	}
	console.log("ende engagement")
	return true
}

//Abfrage der Antwortanzahl auf eigene Beiträge
async function getReplies(nutzer){
	var posts = Reddit_Posts.find({username: nutzer}).fetch();
	var replies = 0
	for(var j=0;j<posts.length;j++){
		replies += posts[j].num_replies;
	} 
	if (replies<1){
		return 1
	}
	return replies
}

//Abfrage aller Upvotes
async function getUps(nutzer){
	var posts = Reddit_Posts.find({username: nutzer}).fetch();
	var ups = 0
	for(var j=0;j<posts.length;j++){
		ups += posts[j].ups;
	} 
	if (ups<1){
		return 1
	}
	return ups
}

//Abfrage aller Downvotes
async function getDowns(nutzer){
	var posts = Reddit_Posts.find({username: nutzer}).fetch();
	var downs = 0
	for(var j=0;j<posts.length;j++){
		downs += posts[j].downs;
	} 
	if (downs<1){
		return 1
	}
	return downs
}

//fasst die Zahlen zu den Beiträgen unter den angegebenen Dimensionen zusammen und speichert durchschnittliche Werte pro Dimension in der Datenbank ab
async function getDimensions(){
	console.log("anfang dimensionen")
    var dimensionsArray=["Emotionen","Produkt und Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","Gesellschaftliche Verantwortung"];
	var dimensionsArray02=["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"];
	var accounts = await Accounts.find({}).fetch();
	var l = accounts.length;
	for(var q=0;q<l;q++){
        var name = accounts[q].username;
        var posts = Reddit_Posts.find({username:name}).fetch()
		if(posts[0] /* && reddit_auth */){
			var noValue = {
                ups: 0,
                downs: 0,
				engagement: 0,
				replies: 0,
				count: 0,
				s_neg: 0,
				s_neu: 0,
				s_pos:0,
				bestEngagement: "none"
			}
			var dimensionen = await Reddit_Dimensionen.find({username:name}).fetch();
			if(!dimensionen[0]){
				Reddit_Dimensionen.insert({
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
				var postInDimension = await Reddit_Posts.find({username: name, dimension: dimensionsArray[i]}).fetch();
				var ups = 0;
				var engagement = 0;
				var replies = 0;
				var downs = 0;
				var count = 0;
				var s_neg= 0;
				var s_neu= 0;
				var s_pos= 0;
				var bestEngagement = "none";
				var bestEngagementScore = 0;
		
				if (postInDimension[0]){
					for (var k=0; k< postInDimension.length; k++){
						ups += postInDimension[k].ups;
						engagement += postInDimension[k].engagement;
						replies += postInDimension[k].num_replies;
						downs += postInDimension[k].downs;
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
					ups = ups/len;
					engagement = engagement/len;
					replies = replies/len;
					downs = downs/len;
					s_gesamt = s_neg + s_neu + s_pos;
					if(s_gesamt>0){
						s_neg = s_neg/s_gesamt;
						s_neu = s_neu/s_gesamt;
						s_pos = s_pos/s_gesamt;
					}
					var value = {
						ups: ups,
						engagement: engagement,
						replies: replies,
						downs: downs,
						count: count,
						bestEngagement: bestEngagement,
						s_neg: s_neg,
						s_pos: s_pos,
						s_neu: s_neu
					}
					Reddit_Dimensionen.update({username: name},{$set:{
						[dimensionsArray02[i]]: value
					}})
				}else{
					Reddit_Dimensionen.update({username: name},{$set:{
						[dimensionsArray02[i]]: noValue
					}})
				}

			}
		}
	}
	console.log("ende dimensionen")
    return true
}

//Abfrage der aktuell beliebtesten Beiträge auf Reddit
async function getHot(){
	console.log("anfang hot")
    var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var a=0;a<len;a++){
		if(accounts[a].sub && accounts[a].sub!=""){
            var name = accounts[a].username;
            var sub = accounts[a].sub;
            let result = await red.getHot(sub, {limit:2})
			let posts =[]
            for(var v=0; v<result.length; v++){
                var post ={
                    title: result[v].title,
                    ups: result[v].ups,
                    downs: result[v].downs,
                    date: new Date(result[v].created_utc*1000),
					link: result[v].url,
					autor: result[v].author.name
                }
                posts.push(post)
            }
            Reddit_Hot.remove({username:name})
            Reddit_Hot.insert({
                username: name,
                posts: posts
            })
        }
	}
	console.log("ende hot")
	return true
}

//Abfrage und Speicherung des täglichen Karmastands
async function getDailyKarma(){
	console.log("anfang karma")
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var i=0;i<len;i++){
		if(accounts[i].reddit_auth){
			var name = accounts[i].username;
			r = accounts[i].requester
			reddit = new snoowrap(r)
			let karma = await reddit.getKarma()
			//console.log(name)
			//console.log(karma[0])
			if(karma[0]){
				commentkarma = karma[0].comment_karma
				postkarma = karma[0].link_karma
				if (Reddit_Karma.find({username: name}).count()>0){
					var daily = checkDaily(Reddit_Karma, name)
					//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
					if (!daily || (!checkCount("postkarma", postkarma, Reddit_Karma, name) && daily) || (!checkCount("commentkarma", commentkarma, Reddit_Karma, name) && daily)){
						//letzten Eintrag löschen, wenn zweiter Fall zutrifft
						if((!checkCount("postkarma", postkarma, Reddit_Karma, name) && daily)||(!checkCount("commentkarma", commentkarma, Reddit_Karma, name) && daily)){
							removeLast(Reddit_Karma, name)
						}
						Reddit_Karma.insert({commentkarma: commentkarma, postkarma: postkarma, date: new Date(), username: name});
					}
				}else{
					Reddit_Karma.insert({commentkarma: commentkarma, postkarma: postkarma, date: new Date(), username: name});
				}
			}
		}
	}
	console.log("ende karma")
	return true
}


async function getDailySubscribersUser(){
	console.log("anfang usersubs")
	var accounts = Accounts.find({}).fetch();
	var len = accounts.length;
	for(var i=0;i<len;i++){
		if(accounts[i].reddit_auth){
			var name = accounts[i].username;
			r = accounts[i].requester
			reddit = new snoowrap(r)
			let subs = await reddit.getMe().subreddit.display_name.subscribers
			if (Reddit_UserSubscriberCount.find({username: name}).count()>0){
						
				//wenn an diesem Tag noch kein Eintrag besteht oder wohl einer besteht und der Wert sich geändert hat -> neuer Eintrag
				if (!checkDaily(Reddit_UserSubscriberCount, name) || (!checkCount("subscriber", subs, Reddit_UserSubscriberCount, name) && checkDaily(Reddit_UserSubscriberCount, name))){
					//letzten Eintrag löschen, wenn zweiter Fall zutrifft
					if(!checkCount("subscriber", subs, Reddit_UserSubscriberCount, name) && checkDaily(Reddit_UserSubscriberCount, name)){
						removeLast(Reddit_UserSubscriberCount, name)
					}
					Reddit_UserSubscriberCount.insert({subscriber: subs, date: new Date(), username: name});
				}
			}else{
				Reddit_UserSubscriberCount.insert({subscriber: subs, date: new Date(), username: name});
			}
		}
	}
	console.log("ende usersubs")
	return true
}
	
	
//Account muss für die Funktion mindestens 30 Tage alt sein und geht vermutlich nur für Subreddit die man erstellt hat oder Moderator ist
/*async function getDailyContributors(name){
let r = await Accounts.find({username:name}).fetch()[0].requester
		reddit = new snoowrap(r)
		let contributors = await reddit.getSubreddit("redditdev").getContributors()
		console.log(contributors)
		console.log("contributors")
}*/

//Funktion die sicherstellt, dass alles abgefragt wird
async function getEverything(){
	let a1 = await getDailySubscribers();
	let a6 = await getHot();
	let a7 = await getDailyKarma();
	let a8 = await getDailySubscribersUser();
	let a9 = await getSentiment();
	let a2 = await getPosts();
	let a3 = await getPostSentiment();
	let a4 = await getEngagement();
	let a5 = await getDimensions();
	return true
}


export async function initialR() {
	//getEverything();
	//var myVar = setInterval(getEverything, 1200000);
	//Accounts.remove({username:"testaccount02"})
	console.log("dimensionen");
	console.log(Reddit_Dimensionen.find({}).fetch());
	console.log("hot");
	console.log(Reddit_Hot.find({}).fetch());
	console.log("karma");
	console.log(Reddit_Karma.find({}).fetch());
	console.log("popular");
	console.log(Reddit_Popular.find({}).fetch());
	console.log("posts");
	console.log(Reddit_Posts.find({}).fetch());
	console.log("usersubscribercount");
	console.log(Reddit_UserSubscriberCount.find({}).fetch());

}

//Sorgtd dafür, dass alle Daten täglich aktualisiert werden
function checkDaily(collection, name){
	var today = new Date();
	var latestObject = collection.findOne({username: name},{ sort:{ date:-1 } })
	if(checkDate(today, latestObject.date)){
		return true
	}
	return false
}

//Überprüfung des datums um Daten entsprechend ihrer Abfrage zuzuordnen
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
