import { Meteor } from 'meteor/meteor';
import { Follower } from '../imports/api/follower.js';
import { Mentions } from '../imports/api/mentions.js';
//import '../imports/server/twitter.js';

Meteor.startup(() => {
  var Twit = require('twit')
  var follower = []

	var TwitterAPI = new Twit({
	consumer_key: "yCR61JPigbhs8tQUDMjy1Bgz3", // API key
	consumer_secret: "ltkN0xgHBeUX9i3mF1fYIQAgsTNYMUc4H6ZyM7sXEvtgVt9JhT", // API secret
	access_token: "2909379863-zqmljlTQrLGZsXN4Q6lnvf7yoBZ7K6DjDl3Qm9y",
	access_token_secret: "KLocQGPdkSY9XI36f45AQGNKQ2xXSQdnoUyzmRJhjxIc7"});


/*function saveFollowers(array){

	for (i=0; i<array.length; i++){
		Follower.insert({number:i+1, id: array[i]})
	}
}

TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"}, function (err, data, response) {getFollowers(data.ids)});
*/

async function getFollowers(){
	let result = await TwitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"});
	follower = result.data.ids.length;
	//saveFollowers(follower);
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
Follower.remove({});
getFollowers();
getMentions();

});
