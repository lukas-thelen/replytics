import { Mongo } from 'meteor/mongo';
 
export const Sentiment = new Mongo.Collection('sentiment');

/*Beinhaltet des Gesamtsentiment aller Kommentare auf einen Nutzer
 Werte: _id, username, s_neg, s_pos, s_neu, s_neg_p, s_pos_p, s_neu_p, s_average
*/