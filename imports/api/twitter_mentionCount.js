import { Mongo } from 'meteor/mongo';
 
export const MentionCount = new Mongo.Collection('mentionCount');

/*Speichert die Anzahl der Mentions mit Historie, ein Eintrag für jeden Tag und Nutzer
 Werte: _id, mentions, authors, date, username
*/
