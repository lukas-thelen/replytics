import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FollowerCount } from '/imports/api/twitter_followerCount';


export class FollowerChart extends Tracker.Component {

  getFollower(){
    var follower = FollowerCount.find({username: Meteor.user().username }, {sort: {date: -1}}).fetch();
    //console.log(follower);
    return follower;
  }

  getFollowerList(){
    var followerList = [];
    var followerDate = [];
    var datum = [];
    var datumStr = ["Sonntag","Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

    if (this.getFollower()[0] != undefined) {
      var follower = this.getFollower();

    var l = follower.length-1;
    if (l>=6){
      l = 6
    }
    //alert(l);
    //alert(follower);
    for(var i=l;i>=0;i--){
      //alert("test");
      followerList.push(follower[i].count);
    }

    


    for(var j=l; j>=0; j--){
      followerDate.push(follower[j].date);
    }



    for(var y=0; y<=l; y++){ //war vorher y=l; y>=0; y--
      datum.push(followerDate[y].getDay());
    }
    if (l>=6){
      l = 6
    }else{
      for(var k=l; k<6;k++){
        datum.push(k-1); //wird in umgekehrter Reihenfolge also 7,6,5,4,... ausgegeben, deshalb noch reversen
      }
    }
    //alert(datum);
    //datum.reverse();

    for(var i=0;i<datum.length;i++){
      datum[i] = datumStr[datum[i]];
    }

    return {
      labels: datum,
      datasets: [
        {
          label: "Follower Anzahl",
          borderColor:["rgb(91, 192, 222)"],
          data: followerList,
          lineTension: 0,
          fill: false
        }
      ]
    }}
  }

  render() {
    if(this.getFollower()[0] != undefined) {
      return (
        <div className="followerchart">
          <h5>Follower Anzahl</h5>
          <div>
          <Line
            options = {{
              bezierCurve: false,
              linetension: 0,
              scales: {yAxes: [{ticks: {suggestedMin: 0, precision:0}}]},
              responsive: true,
              maintainAspectRatio: false
            }}
            data = {this.getFollowerList()}
          />
          </div>
        </div>


      );
    } else {
      return (
        <p> Daten werden geladen...</p>
      );
    }
  }
}
