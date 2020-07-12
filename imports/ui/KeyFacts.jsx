import React, { Component } from 'react';
import Tracker from 'tracker-component';

import { FollowerCount } from '../api/twitter_followerCount';
import { MentionCount } from '../api/twitter_mentionCount.js';
import { RetweetCount } from '../api/twitter_retweetCount.js';


export class KeyFacts extends Tracker.Component {

  getFollower(){
    var follower = FollowerCount.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    if (!follower[0]){
      return [{count:0}]
    }
    return follower;
  }

  get7th() {
    if (this.getFollower()[6] != undefined) {
      return this.getFollower()[6].count;
    } else { 
      var followerUnsorted = FollowerCount.find({username: Meteor.user().username}).fetch();
      if (!followerUnsorted[0]){
        return 0
      }
      return followerUnsorted[0].count;
    }
  }

  getDifference7(){
    var today = this.getFollower()[0].count;
    var old = this.get7th();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  getRetweets(){
    var retweets = RetweetCount.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    if (!retweets[0]){
      return [{retweets:0}]
    }
    return retweets
  }

  get7thRetweetCount(){
    if (this.getRetweets()[6] != undefined) {
      return this.getRetweets()[6].retweets;
    } else { 
      var unsorted = RetweetCount.find({username: Meteor.user().username}).fetch();
      if (!unsorted[0]){
        return 0
      }
      return unsorted[0].retweets;
    }
  }

  getDifference7Retweets(){
    var today = this.getRetweets()[0].retweets;
    var old = this.get7thRetweetCount();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  getMentions() {
    var mentions = MentionCount.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    if (!mentions[0]){
      return [{mentions:0, authors:0}]
    }
    return mentions;
  }

  get7thMentionCount() {
    if (this.getMentions()[6] != undefined) {
      return this.getMentions()[6].mentions;
    } else { 
      var unsorted = MentionCount.find({username: Meteor.user().username}).fetch();
      if (!unsorted[0]){
        return 0
      }
      return unsorted[0].mentions;
    }
  }

  getDifference7mention(){
    var today = this.getMentions()[0].mentions;
    var old = this.get7thMentionCount();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  get7thMentionAuthors() {
    if (this.getMentions()[6] != undefined) {
      return this.getMentions()[6].authors;
    } else { 
      var unsorted = MentionCount.find({username: Meteor.user().username}).fetch();
      if (!unsorted[0]){
        return 0
      }
      return unsorted[0].authors;
    }
  }

  getDifference7authors(){
    var today = this.getMentions()[0].authors;
    var old = this.get7thMentionAuthors();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  render() {
    

    
    if (this.getFollower()[0] != undefined && this.getMentions()[0] != undefined) {
     return (
	 
    <div> 
   
      <h5 className="ueberblick">Überblick
	  <button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier erhalten Sie einen Überblick zur Anzahl Ihrer Follower, Erwähnungen, Autoren und Retweets im Vergleich zur Vorwoche."><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>
      <div className="container row keyfacts">
	   
        <section className="spalte card col-5">
          <h5>Follower Anzahl</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getFollower()[0].count}</h3>
          <h6>{this.getDifference7()} zu letzter Woche</h6>

        </section>

        <section className="spalte card col-5">
          <h5>Erwäh&shy;nungen</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getMentions()[0].mentions}</h3>
          <h6>{this.getDifference7mention()}  zu letzter Woche</h6>
        </section>
		
	
		
        <section className="spalte card col-5">
          <h5>Anzahl Autoren</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getMentions()[0].authors}</h3>
          <h6>{this.getDifference7authors()} zu letzter Woche</h6>
        </section>
  
        <section className="spalte card col-5">
          <h5>Retweets</h5>
          <h3  style={{color:"#A4A4A4"}}>{this.getRetweets()[0].retweets}</h3>
          <h6>{this.getDifference7Retweets()} zu letzter Woche</h6>
        </section>
      </div>
      </div>
     );
    } else {
      return (
        <p> Daten laden.. </p>
      );
    }
 
    
  }
}

