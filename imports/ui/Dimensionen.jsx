import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Posts } from '../api/twitter_posts.js';
import { Dimensionen } from '../api/twitter_dimensionen.js';


export class DimensionenRadar extends Tracker.Component {
  getFollower(){
    var follower = FollowerCount.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    if(follower[i]){
      return follower;
    }
    return 0
  }
  getDimension(){
    var nutzer = Meteor.user().username;
    var gesamtPosts = Posts.find({username: nutzer}).fetch().length;
    var dimensionen= ["Emotionen","Produkt und Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","Gesellschaftliche Verantwortung"]
    var dimensionen02= ["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"]
    var daten = [];
    var count = [];
    var postCount = 0;
    var favorites = 0;
    var engagement = 0;
    var followerSum = [];
    //followerSum = this.getFollower()[0].count;

    /*for (var i=0; i< 6; i++){
      var postInDimension = Posts.find({username: nutzer, dimension: dimensionen[i]}).fetch();
      engagement = 0;

      if (!postInDimension[0]){
        daten.push(0);
      }else{
        for (var k=0; k< postInDimension.length; k++){
        engagement += postInDimension[k].engagement;
      }
      engagement = engagement/ (postInDimension.length);
      daten.push(engagement);
    }
  }

  for (var i=0; i< 6; i++){
    var postInDimension = Posts.find({username: nutzer, dimension: dimensionen[i]}).fetch();
    postCount = 0;

    if (!postInDimension[0]){
      count.push(0);
    }else{
      for (var k=0; k< postInDimension.length; k++){
      postCount += 1;
      }
    count.push(postCount/gesamtPosts);
    }
  }*/
  for (var i=0; i< 6; i++){
    daten.push(parseInt(Dimensionen.find({username:nutzer}).fetch()[0][dimensionen02[i]].engagement*100))
    count.push(parseInt(((Dimensionen.find({username:nutzer}).fetch()[0][dimensionen02[i]].count)/gesamtPosts)*100))
  }

return {
  labels: ["Emotionen", "Produkt/Dienstleitung", "Arbeitsplatzumgebung", "Finanzleistung", "Vision&Führung", "ges. Verantwortung"],
  datasets: [
    {
      label: 'Engagement',
      backgroundColor: 'rgba(92, 184, 92, 0.2)',
      borderColor: 'rgba(92, 184, 92, 0.8)',
      pointBackgroundColor: 'rgba(92, 184, 92, 0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      data: daten
    },
    {
      label: 'Post Count',
      backgroundColor: 'rgba(91, 192, 222, 0.2)',
      borderColor: 'rgb(91, 192, 222)',
      pointBackgroundColor: 'rgb(91, 192, 222)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: count
    }
  ]};
}

  render() {
    return (
      <div>
        <h5 style={{textAlign:"center"}}>Postkategorien Überblick</h5>
        <div>
        <Radar
        data={this.getDimension()}
        options = {{
            responsive: true
          }} />
        </div>
      </div>
    );
  }
};
