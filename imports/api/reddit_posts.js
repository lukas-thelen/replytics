import { Mongo } from 'meteor/mongo';
 
export const Reddit_Posts = new Mongo.Collection('reddit_Posts');

/*Beinhaltet die selber abgesetzten Posts (für jeden Post ein Eintrag)
 Werte: _id, username, id, date, text, dimension, ups, downs, num_replies, replies, s_neg, s_neu, s_pos, engagement
*/