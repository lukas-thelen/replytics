import React, { Component } from 'react';
import Tracker from 'tracker-component';

var snoowrap = require('snoowrap');
 

export class Reddit_Login extends Tracker.Component {
    authenticationUrl = snoowrap.getAuthUrl({
        clientId: 'E6ul0OQ6hTnePQ',
        scope: ['identity', 'wikiread', 'wikiedit'],
        redirectUri: 'http://localhost:3000',
        permanent: true,
        state: 'fe211bebc52eb3da9bef8db6e63104d3' // a random string, this could be validated when the user is redirected back
      });
    
      code = new URL(window.location.href).searchParams.get('code');

      posten =()=>{
        Meteor.call("reddit_post", this.code)
      }

  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
        //alles, was zurück geschickt werden soll
    <div>
    <a href={this.authenticationUrl}>{this.code}</a>
    <input type="button" onClick={this.posten} value="test" />
    </div>
    );
  }
}