import { Mongo } from 'meteor/mongo';
 
export const Reddit_NewSubreddit = new Mongo.Collection('reddit_NewSubreddit');


/*Speichert die letzten 20 Posts im Subreddit und deren Sentiment (für jeden Nutzer ein Eintrag)
 Werte: _id, username, posts, s_pos, s_neg, s_neu, s_pos_n, s_neg_n, s_neu_n, s_average
*/