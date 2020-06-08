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
        <section className="spalte card">
          <h5>Follower Anzahl</h5>
          <h3 style={{color:"#A4A4A4"}}>{this.getFollower()[0].count}</h3>
          <h7>+ {this.getDifference7()} zur Vorwoche</h7>
        </section>

        <section className="spalte card">
          <h5>Erwähnungen</h5>
          <h3 style={{color:"#A4A4A4"}}>{this.props.mentionCount}</h3>
          <h7>Zuwachs in den letzten 7 Tagen: </h7>
        </section>
  
        <section className="spalte card">
          <h5>Anzahl Autoren</h5>
          <h3 style={{color:"#A4A4A4"}}>{this.props.mentionAuthors}</h3>
          <h7>Zuwachs in den letzten 7 Tagen: </h7>
        </section>
  
        <section className="spalte card">
          <h5>Retweets</h5>
		  <h3  style={{color:"#A4A4A4"}}>Zahl</h3>
          <h7>Zuwachs in den letzten 7 Tagen: </h7>
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

