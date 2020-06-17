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
    return today - old;
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
    return today - old;
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
    return today - old;
  }

  get7thMentionAuthors() {
    if (this.getMentions()[6] != undefined) {
      return this.getMentions()[6].authors;
    } else { 
      var unsorted = MentionCount.find({username: Meteor.user().username}).fetch();
      return unsorted[0].authors;
    }
  }

  getDifference7authors(){
    var today = this.getMentions()[0].authors;
    var old = this.get7thMentionAuthors();
    return today - old;
  }

  render() {
    

    
    if (this.getFollower()[0] != undefined && this.getMentions()[0] != undefined) {
     return (
     
    
      <div className="container">
        <section className="spalte card">
          <h5>Follower Anzahl</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getFollower()[0].count}</h3>
          <h6>+{this.getDifference7()} zu letzter Woche</h6>

        </section>

        <section className="spalte card">
          <h5>Erwähnungen</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getMentions()[0].mentions}</h3>
          <h6>+{this.getDifference7mention()}  zu letzter Woche</h6>
        </section>
  
        <section className="spalte card">
          <h5>Anzahl Autoren</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getMentions()[0].authors}</h3>
          <h6>+{this.getDifference7authors()} zu letzter Woche</h6>
        </section>
  
        <section className="spalte card">
          <h5>Retweets</h5>
          <h3  style={{color:"#A4A4A4"}}>{this.getRetweets()[0].retweets}</h3>
          <h6>+ {this.getDifference7Retweets()} zu letzter Woche</h6>
        </section>
      </div>
     );
    } else {
      return (
        <p> Daten laden.. </p>
      );
    }
 
    
  }
}

