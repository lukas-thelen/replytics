import { Meteor } from 'meteor/meteor';
import { Follower } from '../imports/api/follower.js';
import { Mentions } from '../imports/api/mentions.js';
import initial () from '../imports/server/twitter.js';

Meteor.startup(() => {
	initial();

});
