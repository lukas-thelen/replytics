import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FollowerCount } from '/imports/api/twitter_followerCount';


export class FollowerChart extends Tracker.Component {

  getFollower(){
    var follower = FollowerCount.find({}, {sort: {date: -1}}).fetch();
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
    
    //alert(l);
    for(var i=l;i>=0;i--){
      //alert("test");
      followerList.push(follower[i].count);
    }

    /*
    if (l>=6){
      l = 6
    }else{
      for(var x=0; x<7;x++){
        if(followerList[x] == undefined){
          followerList.push(0);
        }
      }
    }*/

    for(var j=l; j>=0; j--){
      followerDate.push(follower[j].date);
    }

    

    for(var y=l; y>=0; y--){
      datum.push(followerDate[y].getDay());
    }
    if (l>=6){
      l = 6
    }else{
      for(var k=6; k>l;k--){
        datum.push(k-1); //wird in umgekehrter Reihenfolge also 7,6,5,4,... ausgegeben, deshalb noch reversen
      }
    }
    
    datum.reverse();
    for(var i=0;i<datum.length;i++){
      datum[i] = datumStr[datum[i]];
    }

    return {
      labels: datum,
      datasets: [
        {
          label: "Follower Anzahl",
          borderColor:["rgba(0, 132, 180, 0.8)"],
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
        <div style ={{position: "relative", width: 600, height: 550}}>
          <h3>Follower Anzahl</h3>
          <Line
            options = {{
              bezierCurve: false,
              linetension: 0,
              scales: {yAxes: [{ticks: {suggestedMin: 0}}]},
              responsive: true
            }}
            data = {this.getFollowerList()}
          />
        </div>

          
      );
    } else {
      return (
        <p> Daten werden geladen...</p>
      );
    }
  }
}
