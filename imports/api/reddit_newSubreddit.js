import { Mongo } from 'meteor/mongo';
 
export const Reddit_NewSubreddit = new Mongo.Collection('reddit_NewSubreddit');


/*Speichert die Texte der neusten 20 Posts des Subreddits mit Sentimentbewertung(absoulte Werte und prozentual)
 Werte: _id, username, posts, s_pos, s_neg, s_neu, s_pos_p, s_neg_p, s_neu_p, s_average
 posts gibt ein array zurück
*/