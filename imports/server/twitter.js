import { Meteor } from 'meteor/meteor';
import { TwitterAPI } from '../api/twitter_credentials.js';
import { Follower } from '../api/twitter_follower.js';
import { Mentions } from '../api/twitter_mentions.js';
import { MentionCount } from '../api/twitter_mentionCount.js';

var Twit = require('twit');


async function getFollowers(){
	var follower = []
	let result = await TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"});
	follower = result.data.ids.length;
	Follower.insert({count: follower, date: new Date()});
	console.log(Follower.find({}).fetch())
}


async function getMentions(){
	let result = await TwitterAPI.get('statuses/mentions_timeline', { screen_name:"@FlorianKindler"});
	mentionArray = result.data;
	var authorCount = 0

	for (i=0; i<mentionArray.length; i++){
		var author = Mentions.find({author: mentionArray[i].user.name}).fetch();
		if(!author[0]){
			authorCount ++
		}	
		Mentions.insert({
			date: mentionArray[i].created_at,
			id01: mentionArray[i].id,
			id02: mentionArray[i].id_str,
			content: mentionArray[i].text,
			author: mentionArray[i].user.name
		})

	}
	MentionCount.insert({date: new Date(), mentions: mentionArray.length, authors: authorCount})
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
