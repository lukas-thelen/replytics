import { Mongo } from 'meteor/mongo';
 
export const Reddit_Karma = new Mongo.Collection('reddit_karma');

/*Speichert die Karmawerte eines Nutzers mit Historie, einen Eintrag für einen Tag und Nutzer
 Werte: _id, commentkarma, postkarma, date, username
*/