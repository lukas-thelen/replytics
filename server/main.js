import { Meteor } from 'meteor/meteor';
import { initial } from '../imports/server/twitter.js';
import { initialR } from '../imports/server/reddit.js';

Meteor.startup(() => {
	initial();
	initialR();
});
