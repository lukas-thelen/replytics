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
          <h5 className="followerverlauf">Follower-Verlauf
		  <button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier ist der Zuwachs Ihrer Follower der letzten Woche graphisch dargestellt. Der aktuelle Tag befindet sich immer an erster Stelle."><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>
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
