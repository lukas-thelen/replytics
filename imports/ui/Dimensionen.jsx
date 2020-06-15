import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Posts } from '../api/twitter_posts.js';


export class Dimensionen extends Tracker.Component {
  getFollower(){
    var follower = FollowerCount.find({username: Meteor.user().username}, {sort: {date: -1}}).fetch();
    return follower;
  }
  getDimension(){
    var dimensionen= ["Emotionen","Produkt und Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","Gesellschaftliche Verantwortung"]
    var daten = [];
    var count = [];
    var postCount = 0;
    var favorites = 0;
    var engagement = 0;
    var followerSum = [];
    followerSum = this.getFollower()[0].count;

    for (var i=0; i< 6; i++){
      var postInDimension = Posts.find({dimension: dimensionen[i]}).fetch();
      favorites = 0;

        if (!postInDimension[0]){
          daten.push(0);
        }else{
          for (var k=0; k< postInDimension.length; k++){
          favorites += postInDimension[k].fav;
        }
  engagement = favorites/ (postInDimension.length)/ followerSum;
  daten.push(engagement);
  }
}

for (var i=0; i< 6; i++){
  var postInDimension = Posts.find({dimension: dimensionen[i]}).fetch();
  postCount = 0;

    if (!postInDimension[0]){
      count.push(0);
    }else{
      for (var k=0; k< postInDimension.length; k++){
      postCount += 1;
    }
  count.push(postCount);
  }
}

return {
  labels: ["Emotional Appeal", "Products/ Services", "Workplace Environment", "Financial Performance", "Vision/Leadership", "Social/Environmental Responsibility"],
  datasets: [
    {
      label: 'Engagement',
      backgroundColor: 'rgba(51, 164, 255,0.3)',
      borderColor: 'rgba(51, 164, 255,1)',
      pointBackgroundColor: 'rgba(51, 164, 255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      data: daten
    },
    {
      label: 'Post Count',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      pointBackgroundColor: 'rgba(255,99,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: count
    }
  ]};
}
  displayName: 'Reputation Management Quotient';

  render() {
    return (
      <div style ={{position: "relative", width: 550, height: 350}}>
        <Radar
        data={this.getDimension()}
        options = {{
            responsive: true
          }} />
      </div>
    );
  }
};
