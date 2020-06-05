import React, { Component } from 'react';
import Tracker from 'tracker-component';

import { FollowerCount } from '../api/twitter_followerCount';



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

  render() {
    

    
    if (this.getFollower()[0] != undefined) {
     return (
     
    
      <div className="container">
        <section className="spalte">
          <h5>Follower Anzahl</h5>
          <h6>{this.getFollower()[0].count}</h6>
          <h6>+ {this.getDifference7()} zur Vorwoche</h6>
        </section>

        <section className="spalte">
          <h5>Erwähnungen</h5>
          <h6>{this.props.mentionCount}</h6>
          <h6>Zuwachs in den letzten 7 Tagen: </h6>
        </section>
  
        <section className="spalte">
          <h5>Anzahl Autoren</h5>
          <h6>{this.props.mentionAuthors}</h6>
          <h6>Zuwachs in den letzten 7 Tagen: </h6>
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

