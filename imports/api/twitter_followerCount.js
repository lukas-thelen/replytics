import { Mongo } from 'meteor/mongo';
 
export const FollowerCount = new Mongo.Collection('followerCount');

/*Speichert die Werte für den Followerverlauf des Nutzers, ein Eintrag für jeden Tag und Nutzer
 Werte: _id, count, date, username
*/