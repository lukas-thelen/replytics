import { Mongo } from 'meteor/mongo';
 
export const Reddit_SubscriberCount = new Mongo.Collection('reddit_subscriberCount');

/*Speichert die Werte für den Subscriberverlauf eines Subreddits, einen Wert für einen Tag
 Werte: _id, subcriber, date, username, subreddit
*/