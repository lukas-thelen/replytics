import { Meteor } from 'meteor/meteor';
import { Follower } from '../imports/api/follower.js';
import { Mentions } from '../imports/api/mentions.js';
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
	for (i=0; i<mentionArray.length; i++){
		Mentions.insert({
			date: mentionArray[i].created_at,
			id01: mentionArray[i].id,
			id02: mentionArray[i].id_str,
			content: mentionArray[i].text,
			unsername: mentionArray[i].user.name,
		})	
	}
	console.log(Mentions.find({}).fetch())
}

function initial (){
	Follower.remove({});
	getFollowers();
	getMentions();
}
