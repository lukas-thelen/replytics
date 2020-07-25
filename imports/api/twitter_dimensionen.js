import { Mongo } from 'meteor/mongo';
 
export const Dimensionen = new Mongo.Collection('dimensionen');

/*Speichert die Durchschnittlichen Kennwerte der Posts jeder Dimension (für jeden Nutzer ein Eintrag)
 Werte: _id, Emotionen, Produkt_und_Dienstleistung, Arbeitsplatzumgebung, Finanzleistung, Vision_und_Führung, Gesellschaftliche_Verantwortung
 die Dimensionen sind jeweils Objekte mit folgenden Werten: favorites, engagement, replies, retweets, count, s_neg, s_pos, s_neu, bestEngagement
*/