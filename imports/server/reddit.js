import { Meteor } from 'meteor/meteor';
import { RedditContent } from 'snoowrap';

import { Accounts } from '../api/accounts.js';


//import { TwitterAPI } from '../api/twitter_credentials.js';

var snoowrap = require('snoowrap');

const r = new snoowrap({
    userAgent: 'replytics for web v0 (by u/replytics)',
    clientId: 'E6ul0OQ6hTnePQ',
    clientSecret: '--2tzGInEmSscmccd32ozQjf-wE',
    refreshToken: '553271810001-VLKWIbnsuaBvJBV5rskKFI7ZjLA'
});

Meteor.methods({
    async reddit_post(code){
        console.log(code)
		snoowrap.fromAuthCode({
            code: code,
            userAgent: 'My app',
            clientId: 'foobarbazquuux',
            redirectUri: 'example.com'
          }).then(r => {
            // Now we have a requester that can access reddit through the user's account
            r.submitSelfpost({
                subredditName: 'test',
                title: 'This is a selfpost',
                text: 'This is the text body of the selfpost'
              }).then(console.log)
          })
	}
})







/*var RedditApi = require('reddit-oauth');
var reddit = new RedditApi({
    app_id: 'E6ul0OQ6hTnePQ',
    app_secret: '--2tzGInEmSscmccd32ozQjf-wE',
    redirect_uri: 'http://localhost:3000'
});

*/

export async function initialR() {
 
    //r.getHot().map(post => post.title).then(console.log);
    //let data = await r.getUser('ThyfaultTime').getSubmissions()
    //let com = await data[0].comments.fetchAll()
    //console.log(com)
    /*r.submitSelfpost({
        subredditName: 'test',
        title: 'This is a selfpost',
        text: 'This is the text body of the selfpost'
      }).then(console.log)*/
     // r.getTop('test').then(console.log)
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
    // Get the `code` querystring param (assuming the user was redirected from reddit)
    let v = await r.getOauthScopeList()
    console.log(v)
}
  