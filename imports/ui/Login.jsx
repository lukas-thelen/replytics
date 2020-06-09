import React, { Component } from 'react';
import Tracker from 'tracker-component';
import { Accounts } from '../api/accounts.js'
import { FollowerCount } from '../api/twitter_followerCount.js';

var Codebird = require("codebird");
var cb = new Codebird;
cb.setConsumerKey("yCR61JPigbhs8tQUDMjy1Bgz3", "ltkN0xgHBeUX9i3mF1fYIQAgsTNYMUc4H6ZyM7sXEvtgVt9JhT");




export class Login extends Tracker.Component {
  constructor () {
    super();

    this.state = {
      token: "test"
    };
  }


  authorizeatTwitter = async (event) => {
    event.preventDefault();
    cb.__call("oauth_requestToken", { oauth_callback: "oob" }, function(
      reply,
      rate,
      err
    ) {

      if (err) {
        console.log("error response or timeout exceeded" + err.error);
      }
      if (reply) {
        if (reply.errors && reply.errors["415"]) {
          // check your callback URL
          console.log(reply.errors["415"]);
          return;
        }

      // stores the token
      cb.setToken(reply.oauth_token, reply.oauth_token_secret);

      // gets the authorize screen URL
      cb.__call("oauth_authorize", {}, function(auth_url) {
        window.codebird_auth = window.open(auth_url,'_blank');
      });
      }
    });
  }

  changeToken = (event) => {
    event.preventDefault()
    this.setState({token: event.target.value});
  }

  verifyPin = (event) => {
    event.preventDefault()
    var twitterpin = this.state.token;
    cb.__call(
      "oauth_accessToken",
      { oauth_verifier: twitterpin },
      function(reply, rate, err) {
  //Wenn Error:
        if (err) {
          console.log("error response or timeout exceeded" + err.error);
        }
  //Wenn erfolgreich enthält cb die Authentifizierungstoken des Nutzers
        if (reply) {
          cb.setToken(reply.oauth_token, reply.oauth_token_secret);

          var userExists = Accounts.find({username: Meteor.user().username}).fetch()
          if(!userExists[0]){
            Accounts.insert({
              owner: Meteor.userId(),
              username: Meteor.user().username,
              token: reply.oauth_token,
              secret: reply.oauth_token_secret,
              id: reply.user_id,
              screen_name: reply.screen_name
            });
          }else{
            Meteor.call('updateTwitterAuth', reply)
          }

          console.log(Accounts.find({}).fetch());
        }
      }
    );

    event.target.reset();
	}


  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
        //alles, was zurück geschickt werden soll
    <div>
    <form onSubmit={ this.authorizeatTwitter }>
      <input type="submit" value="Code generieren"></input>
    </form>
      <form id ="login" onSubmit={ this.verifyPin }>
        <label htmlFor="twitterpin">Twitter PIN bitte hier eingeben:</label><br/>
        <input
          type="number"
          id="twitterpin"
          name="twitterpin"
          onChange={ this.changeToken }
        /><br/>
        <input type="submit" value="abschicken"></input>
      </form>
    </div>
    );
  }
}
