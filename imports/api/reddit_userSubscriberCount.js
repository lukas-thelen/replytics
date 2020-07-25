import { Mongo } from 'meteor/mongo';
 
export const Reddit_UserSubscriberCount = new Mongo.Collection('reddit_userSubscriberCount');

/*Beinhaltet die Zahl der Subscriber des Nutzeraccounts und die Historie, einen Wert für einen Tag und Nutzer
 Werte: _id, subcriber, date, username
*/