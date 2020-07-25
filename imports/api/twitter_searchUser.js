import { Mongo } from 'meteor/mongo';
 
export const SearchUser = new Mongo.Collection('searchUser');

/*Speichert letzten 3 Posts des mit der Suchfunktion gesuchten Nutzers (für jeden Nutzer ein Eintrag - wird bei nächster Suche gelöscht)
 Werte: _id, username, posts
 posts ist ein Array von Objekten mit den Attributen: text, autor, favotites, date
*/