import { Mongo } from 'meteor/mongo';
 
export const Reddit_Hot = new Mongo.Collection('reddit_hot');

/*Beinhaltet die 3 aktuell relevantesten Posts des angegebenen Subreddits (hot) (für jeden Nutzer ein Eintrag)
 Werte: _id, username, posts
 posts ist ein Array mit 3 Objekten mit den folgenden Attributen: title, ups, downs, date, link, autor 
*/