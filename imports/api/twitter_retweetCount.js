import { Mongo } from 'meteor/mongo';
 
export const RetweetCount = new Mongo.Collection('retweetCount');

/*Beinhaltet die Anzahl der Retweets mit Historie, ein Eintrag für jeden Tag und Nutzer
 Werte: _id, retweets, date, username
*/