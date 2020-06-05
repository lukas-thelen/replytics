import React, { Component } from 'react';
import Tracker from 'tracker-component';

import { FollowerCount } from '../api/twitter_followerCount';
import { MentionCount } from '../api/twitter_mentionCount.js';


export class KeyFacts extends Tracker.Component {

  getFollower(){
    var follower = FollowerCount.find({}, {sort: {date: -1}}).fetch();
    return follower;
  }

  get7th() {
    if (this.getFollower()[6] != undefined) {
      return this.getFollower()[6].count;
    } else { 
      var followerUnsorted = FollowerCount.find({}).fetch();
      return followerUnsorted[0].count;
    }
  }

  getDifference7(){
    var today = this.getFollower()[0].count;
    var old = this.get7th();
    return today - old;
  }

  getMentions() {
    var mentions = MentionCount.find({}, {sort: {date: -1}}).fetch();
    return mentions;
  }

  get7thMentionCount() {
    if (this.getMentions()[6] != undefined) {
      return this.getMentions()[6].mentions;
    } else { 
      var unsorted = MentionCount.find({}).fetch();
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
      var unsorted = MentionCount.find({}).fetch();
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
        <section className="spalte">
          <h5>Follower Anzahl</h5>
          <h6>{this.getFollower()[0].count}</h6>
          <h6>Zuwachs in den letzten 7 Tagen: {this.getDifference7()} </h6>
        </section>

        <section className="spalte">
          <h5>Erwähnungen</h5>
          <h6>{this.getMentions()[0].mentions}</h6>
          <h6>Zuwachs in den letzten 7 Tagen: {this.getDifference7mention()} </h6>
        </section>
  
        <section className="spalte">
          <h5>Anzahl Autoren</h5>
          <h6>{this.getMentions()[0].authors}</h6>
          <h6>Zuwachs in den letzten 7 Tagen: {this.getDifference7authors()} </h6>
        </section>
  
        <section className="spalte">
          <h5>Retweets</h5>
          <h6>Platz für Text</h6>
          <h6>Zuwachs in den letzten 7 Tagen: </h6>
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

