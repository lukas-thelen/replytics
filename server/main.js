import { Meteor } from 'meteor/meteor';
import { initial } from '../imports/server/twitter.js';


Meteor.startup(() => {
	initial();

});
