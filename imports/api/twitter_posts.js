import { Mongo } from 'meteor/mongo';
 
export const Posts = new Mongo.Collection('posts');

/*Beinhaltet die selber abgesetzten Posts (für jeden Post ein Eintrag)
 Werte: _id, username, id, date, text, dimension, fav, retweets, retweet, replies, s_neg, s_neu, s_pos, engagement
*/