import { Meteor } from 'meteor/meteor';
import { initial } from '../imports/server/twitter.js';
import { initialR } from '../imports/server/reddit.js';

//startet die Funktionen aus twitter.js und reddit.js bei Start des Servers
Meteor.startup(() => {
	initial();
	initialR();
});
