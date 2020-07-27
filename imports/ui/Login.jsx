import React, { Component } from 'react';
import Tracker from 'tracker-component';
import { Accounts } from '../api/accounts.js'
import { FollowerCount } from '../api/twitter_followerCount.js';
import { credentials } from "../api/access_Token.js"

var Codebird = require("codebird");
var cb = new Codebird;
cb.setConsumerKey(credentials.key, credentials.token);

//Seite, um sich mit seinem Twitter Account zu autorisieren
export class Login extends Tracker.Component {
  constructor (props) {
    super(props);
    this.state = {
      token: "test"
    };
  }

  //leitet den Nutzer zur Twitter-Autorisierungs-Seite weiter
  authorizeatTwitter = async (event) => {
    event.preventDefault();
    cb.__call("oauth_requestToken", { oauth_callback: "oob" }, async function(
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
      let wait = await Accounts.insert({reply:reply, err:err, rate:rate})

      cb.setToken(reply.oauth_token, reply.oauth_token_secret);

      // gets the authorize screen URL
      cb.__call("oauth_authorize", {}, function(auth_url) {
        window.codebird_auth = window.open(auth_url,'_blank');
      });      
      }
    });
  }

  //Reaktion auf Eingabe
  changeToken = (event) => {
    event.preventDefault()
    this.setState({token: event.target.value});
  }

  //fragt Access-Token an und speichert diesen in der DB + neue Daten abrufen
  verifyPin = async (event) => {
    event.preventDefault()
    var twitterpin = this.state.token;
    //Meteor.call("sendToken", twitterpin)
    
    let test02 = test.bind(this);
    cb.__call(
      "oauth_accessToken",
      { oauth_verifier: twitterpin }, 
      async function (reply, rate, err){ test02(reply, rate, err)
      })
      async function test(reply, rate, err) {
        console.log("oben")
  //Wenn Error:
        if (err) {
          console.log("error response or timeout exceeded" + err.error);
        }
  //Wenn erfolgreich enthält cb die Authentifizierungstoken des Nutzers
        if (reply) {
          cb.setToken(reply.oauth_token, reply.oauth_token_secret);
          var userExists = Accounts.find({username: Meteor.user().username}).fetch()
          if(!userExists[0]){
            let test02 = await Accounts.insert({
              owner: Meteor.userId(),
              username: Meteor.user().username,
              twitter_auth: true,
              token: reply.oauth_token,
              secret: reply.oauth_token_secret,
              id: reply.user_id,
              screen_name: reply.screen_name
            });
            let test = await Meteor.callPromise('updateServer', Meteor.user().username)
            this.props.twitter_authorization();
          }else{
            let test03 = await Meteor.callPromise('updateTwitterAuth', reply)
            let test04 = await Meteor.callPromise('updateServer', Meteor.user().username)
            this.props.twitter_authorization();
          }
          
        }
      } ;
  }

/*  test = async()=>{
    console.log("unten")
    cb.setToken(reply.oauth_token, reply.oauth_token_secret);
    var userExists = Accounts.find({username: Meteor.user().username}).fetch()
    if(!userExists[0]){
      await Accounts.insert({
        owner: Meteor.userId(),
        username: Meteor.user().username,
        twitter_auth: true,
        token: reply.oauth_token,
        secret: reply.oauth_token_secret,
        id: reply.user_id,
        screen_name: reply.screen_name
      });
    }else{
      await Meteor.callPromise('updateTwitterAuth', reply)
    }
    let test = await Meteor.callPromise('updateServer');
    console.log(test)
    console.log(Accounts.find({}).fetch());
    this.props.twitter_authorization();
    event.target.reset();
  }
*/
  //Darstellung auf dem Dashboard
  render() {
      
    return (
        
      <div>
        <div className="col col-md-2 offset-md-5 text-center">
          <form className="mt-5 " onSubmit={ this.authorizeatTwitter }>
            <input className="btn btn-secondary mb-2" type="submit" value="Code generieren"></input><br/>
            <label className="text-left font-weight-light">* Genriere einen Code, um replytics Zugriff auf dein Twitter Konto zu gewähren.</label><br/>
          </form>
          <hr className="mt-4 mb-4 " />
          <form id ="login" onSubmit={ this.verifyPin }>
            <label className="text-left" htmlFor="twitterpin">Twitter Code bitte hier eingeben:</label><br/>
            <input
              type="number"
              id="twitterpin"
              name="twitterpin"
              onChange={ this.changeToken }
              className="form-control"
            /><br/>
            <input className="btn btn-secondary mr-1" type="submit" value="autorisieren"></input>
            <input className="btn btn-light ml-1" type="button" value="abbrechen" onClick={this.props.twitter_authorization}></input>
          </form>
        </div>
      </div>
    );
  }
}
