import React, { Component } from 'react';
import Tracker from 'tracker-component';

var snoowrap = require('snoowrap');
 

export class Reddit_Login extends Tracker.Component {
    authenticationUrl = snoowrap.getAuthUrl({
        clientId: 'E6ul0OQ6hTnePQ',
        scope: ['identity', 'wikiread', 'wikiedit','account', 'creddits','edit',
          'flair', 'history', 'livemanage', 'mysubreddits', 'read', 'report',
          'save', 'submit', 'subscribe', 'vote','modconfig', 'modflair', 'modlog', 'modposts', 'modwiki'],
        redirectUri: 'http://localhost:3000',
        permanent: true,
        state: 'fe211bebc52eb3da9bef8db6e63104d3' // a random string, this could be validated when the user is redirected back
      });
    
      code = new URL(window.location.href).searchParams.get('code');

      posten =()=>{
        Meteor.call("reddit_posten", Meteor.user().username, "Testpost02", "das ist ein sher toller Test", "Finanzleistung")
      }

  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
        //alles, was zurück geschickt werden soll
    <div>
    <a href={this.authenticationUrl}>{this.code}jhsdfashdfas</a>
    <input type="button" onClick={this.posten} value="test" />
    </div>
    );
  }
}