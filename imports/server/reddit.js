import { Meteor } from 'meteor/meteor';
import { RedditContent } from 'snoowrap';


//import { TwitterAPI } from '../api/twitter_credentials.js';

var snoowrap = require('snoowrap');

const r = new snoowrap({
    userAgent: 'replytics for web v0 (by u/replytics)',
    clientId: 'E6ul0OQ6hTnePQ',
    clientSecret: '--2tzGInEmSscmccd32ozQjf-wE',
    refreshToken: '553271810001-3tc_6zt9NjYfRzD6mXzQZpRTEbs'
});


/*var RedditApi = require('reddit-oauth');
var reddit = new RedditApi({
    app_id: 'E6ul0OQ6hTnePQ',
    app_secret: '--2tzGInEmSscmccd32ozQjf-wE',
    redirect_uri: 'http://localhost:3000'
});

*/

export function initialR() {
 
    r.getHot().map(post => post.title).then(console.log);

    /*// Authenticate with username/password
    reddit.passAuth(
    'replytics',
    'replytics1234',
    function (success) {
        if (success) {
            // Print the access token we just retrieved
            console.log(reddit.access_token);
        } else {
            console.log('Auth failed');
        }
    }
   
    );
     */
}
  