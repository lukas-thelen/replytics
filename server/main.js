import { Meteor } from 'meteor/meteor';
//import { Follower } from '../imports/api/twitter_follower.js';
//import { Mentions } from '../imports/api/twitter_mentions.js';
import { initial } from '../imports/server/twitter.js';
var Twit = require('twit');


Meteor.startup(() => {
	initial();

});
