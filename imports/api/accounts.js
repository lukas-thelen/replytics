import { Mongo } from 'meteor/mongo';
 
export const Accounts = new Mongo.Collection('accounts');

/*Speichert die Accounts der ReplyticsUser
 Werte: _id, owner, username
*/
