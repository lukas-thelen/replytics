import { Mongo } from 'meteor/mongo';
 
export const Mentions = new Mongo.Collection('mentions');

/*Beinhaltet alle Mentions (Nachrichten, in denen man erwähnt wurde) 
Werte: _id, id01, id02, content, author, username, sentiment
*/