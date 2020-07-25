import { Mongo } from 'meteor/mongo';
 
export const Reddit_Popular = new Mongo.Collection('reddit_popular');

/*Speichert die über die Suchfunktion gesuchten Posts (für jeden Nutzer ein Eintrag - wird bei nächster Suche des Nutzers gelöscht)
 Werte: _id, username, posts
 posts ist ein Array vo Objekten mit den Attributen: text, autor, ups, downs, subreddit, date, link
*/