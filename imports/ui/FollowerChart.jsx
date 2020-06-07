import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { Line } from 'react-chartjs';
import { FollowerCount } from '/imports/api/twitter_followerCount';


export class FollowerChart extends Tracker.Component {
  async getFollowerList(){
    let follower = await FollowerCount.find({}, {sort: {date: -1}}).fetch();
    var followerList = [];
    var followerDate = [];
    var datum = [];
    var datumStr = ["Sonntag","Monatg", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    var l = follower.length-1;
    if (l>=6){
      l = 6
    }else{
      for(var x=6; x>l;x--){
        followerList.push(0);
      }
    }
    for(var i=l;i>=0;i--){
      followerList.push(follower[i].count);
    }

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
    for(var i=0;i<datum.length;i++)
      datum[i] = datumStr[datum[i]];

    this.setState({data: {
      labels: datum,
      datasets: [
        {
          label: "Follower Anzahl",
          backgroundColor:["rgba(255, 99, 132, 0.2)"],
          data: followerList
        }
      ]
    }})
  }

  constructor(props) {
    super(props);
    this.getFollowerList();
    this.state = {

      data: {
        labels: ["1","2","3","4","5","6","7"],
        datasets: [
          {
            label: "Follower Anzahl",
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            data: [0,0,0,0,0,0,0]
          }
        ]
      }
    }
  }



  render() {
      return (
        <div style ={{position: "relative", width: 600, height: 550}}>
          <h3>Follower Anzahl</h3>
          <Line
            options = {{
              responsive: true
            }}
            data = {this.state.data}
          />
        </div>


    );
  }
}
