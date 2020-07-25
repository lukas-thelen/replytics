import { Mongo } from 'meteor/mongo';
 
export const Accounts = new Mongo.Collection('accounts');


/*Speichert für jeden Nutzer die Zugriffstokens und Nutzernamen
 Werte: _id, owner, username, r_name, sub, reddit_auth, requester, id, screen_name, scret, token, twitter_auth
*/