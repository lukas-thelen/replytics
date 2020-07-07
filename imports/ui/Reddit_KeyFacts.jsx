import React, { Component } from 'react';
import Tracker from 'tracker-component';

import { PostKarmaCount } from '../api/twitter_mentionCount.js';
import { RetweetCount } from '../api/twitter_retweetCount.js';
import { Reddit_UserSubscriberCount } from '../api/reddit_userSubscriberCount';
import { Reddit_SubscriberCount } from '../api/reddit_subscriberCount.js';
import { Reddit_Karma } from '../api/reddit_karma.js';
import { Accounts } from '../api/accounts.js'


export class Reddit_KeyFacts extends Tracker.Component {

  getUserSub(){
    var subs = Reddit_UserSubscriberCount.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    if (!subs[0]){
      return [{subscriber:0}]
    }
    return subs;
  }

  get7th() {
    if (this.getUserSub()[6] != undefined) {
      return this.getUserSub()[6].subscriber;
    } else { 
      var subsUnsorted = Reddit_UserSubscriberCount.find({username: Meteor.user().username}).fetch();
      if (!subsUnsorted[0]){
        return 0
      }
      return subsUnsorted[0].subscriber;
    }
  }

  getDifference7(){
    var today = this.getUserSub()[0].subscriber;
    var old = this.get7th();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  getSubSubs(){
    var acc = Accounts.find({username: Meteor.user().username}).fetch()
    var sub = acc[0].sub
    var subSubs = Reddit_SubscriberCount.find({username: Meteor.user().username, subreddit: sub}, {sort: {date: -1}}).fetch();
    if (!subSubs[0]){
      return [{subSubs:0}]
    }
    return subSubs
  }

  get7thRetweetCount(){
    if (this.getSubSubs()[6] != undefined) {
      return this.getSubSubs()[6].subscriber;
    } else { 
      var acc = Accounts.find({username: Meteor.user().username}).fetch()
      var sub = acc[0].sub
      var unsorted = Reddit_SubscriberCount.find({username: Meteor.user().username, subreddit: sub}).fetch();
      if (!unsorted[0]){
        return 0
      }
      return unsorted[0].subscriber;
    }
  }

  getDifference7SubSubs(){
    var today = this.getSubSubs()[0].subscriber;
    var old = this.get7thRetweetCount();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  getKarma() {
    var karma = Reddit_Karma.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    if (!karma[0]){
      return [{postkarma:0, commentskarma:0}]
    }
    return karma;
  }

  get7thPostKarmaCount() {
    if (this.getKarma()[6] != undefined) {
      return this.getKarma()[6].postkarma;
    } else { 
      var unsorted = Reddit_Karma.find({username: Meteor.user().username}).fetch();
      if (!unsorted[0]){
        return 0
      }
      return unsorted[0].postkarma;
    }
  }

  getDifference7PostKarma(){
    var today = this.getKarma()[0].postkarma;
    var old = this.get7thPostKarmaCount();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  get7thCommentKarma() {
    if (this.getKarma()[6] != undefined) {
      return this.getKarma()[6].commentkarma;
    } else { 
      var unsorted = Reddit_Karma.find({username: Meteor.user().username}).fetch();
      return unsorted[0].commentkarma;
    }
  }

  getDifference7CommentKarma(){
    var today = this.getKarma()[0].commentkarma;
    var old = this.get7thCommentKarma();
    var value = today - old
    if (value >=0){
      return "+"+ value
    }
    return value;
  }

  render() {
    

    
    if (this.getUserSub()[0] != undefined && this.getKarma()[0] != undefined) {
     return (
	 
    <div> 
   
      <h5 className="ueberblick">Überblick
	  <button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier erhalten Sie einen Überblick zur Anzahl Ihrer Follower, Erwähnungen, Autoren und SubSubs im Vergleich zur Vorwoche."><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>
      <div className="container row keyfacts">
	   
        <section className="spalte card col-5">
          <h5>Nutzer Follower</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getUserSub()[0].subscriber}</h3>
          <h6>{this.getDifference7()} zu letzter Woche</h6>

        </section>

        <section className="spalte card col-5">
          <h5>Post Karma</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getKarma()[0].postkarma}</h3>
          <h6>{this.getDifference7PostKarma()}  zu letzter Woche</h6>
        </section>
		
	
		
        <section className="spalte card col-5">
          <h5>Kom&shy;men&shy;tar Karma</h5>

          <h3 style={{color:"#A4A4A4"}}>{this.getKarma()[0].commentkarma}</h3>
          <h6>{this.getDifference7CommentKarma()} zu letzter Woche</h6>
        </section>
  
        <section className="spalte card col-5">
          <h5>Subred&shy;dit Follower</h5>
          <h3  style={{color:"#A4A4A4"}}>{this.getSubSubs()[0].subscriber}</h3>
          <h6>{this.getDifference7SubSubs()} zu letzter Woche</h6>
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

