import React, { Component } from 'react';
import Tracker from 'tracker-component';
//Import des Charttyps aus react-chart-js-2
import { Line } from 'react-chartjs-2';
//Import Daten
import { Reddit_SubscriberCount } from '../api/reddit_subscriberCount.js';
import {Accounts} from '../api/accounts.js'
import ReactTooltip from 'react-tooltip'

//Reddit Followerverlaufschart
export class RedditSubscriberChart extends Tracker.Component {
  //Funktion, die die Subscriber für Reddit zurückgibt
  getSubscriber_r(){
    var acc = Accounts.find({username: Meteor.user().username}).fetch()
    var sub = acc[0].sub
    var subscriber = Reddit_SubscriberCount.find({username: Meteor.user().username, subreddit: sub}, {sort: {date: -1}}).fetch();

    return subscriber;
  }
  //Funktion, die die minimale Followeranzahl um 1 verringert zurückgibt
  getMin(){
    var list = this.getSubscriberList_r().datasets[0].data
    var min = Math.min(...list)
    if (Math.max(...list)-min <6){
      return min-1
    }
    return undefined
  }
  //Funktion, die die maximale Followeranzahl um 1 erhöht zurückgibt
  getMax(){
    var list = this.getSubscriberList_r().datasets[0].data
    var max = Math.max(...list)
    if (max-Math.min(...list) <6){
      return max+1
    }
    return undefined
  }
  // Funktion gibt die Entwicklung der Subscriberanzahl innerhalb einer Woche an und die Daten für das Chart zurück
  getSubscriberList_r(){
    var subscriberList = [];
    var subscriberDate = [];
    var datum = [];
    var datumStr = ["Sonntag","Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

    if (this.getSubscriber_r()[0] != undefined) {
      var subscriber = this.getSubscriber_r();

    var l = subscriber.length-1;
    if (l>=6){
      l = 6
    }

    for(var i=l;i>=0;i--){
      subscriberList.push(subscriber[i].subscriber);
    }

    for(var j=l; j>=0; j--){
      subscriberDate.push(subscriber[j].date);
    }



    for(var y=0; y<=l; y++){
      datum.push(subscriberDate[y].getDay());
    }
    var last = datum.length-1;
    for(var k=l; k<6;k++){
      if(last<0){
        var d = 0
      }else{
        var d = (datum[last]+1)%7;
      }
      datum.push(d);
      last += 1
    }


    for(var i=0;i<datum.length;i++){
      datum[i] = datumStr[datum[i]];
    }

    return {
      labels: datum,
      datasets: [
        {
          label: "Subscriber Anzahl",
          borderColor:["rgb(91, 192, 222)"],
          data: subscriberList,
          lineTension: 0,
          fill: false
        }
      ]
    }}
  }

  render() {
    if(this.getSubscriber_r()[0] != undefined && this.props.renderCondition) {
      let minimum = this.getMin()
      let maximum = this.getMax()
      return (
        <div className="followerchart">
          <ReactTooltip />
          <h5 className="followerverlauf">Subscriber-Verlauf
		  <button className="hover btn btn-link alert-light" data-toggle="tooltip" data-tip="Hier ist der Zuwachs der Subscriber Ihres Subreddits der letzten Woche graphisch dargestellt. Der aktuelle Tag befindet sich immer an erster Stelle."><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>
          <div>
          <Line
            options = {{
              bezierCurve: false,
              linetension: 0,
                //setzt die min und max Werte der Y-Achse auf die (höchsten + 1) und (niedrigsten - 1) Subscriberzahl, wenn die Differenz dazwischen kleiner als 20 ist
              scales: {yAxes: [{ticks: {min: minimum, max:maximum, precision:0}}]},
              responsive: true,
              maintainAspectRatio: false
            }}
            data = {this.getSubscriberList_r()}
          />
          </div>
        </div>


      );
    } else {
      return (
        null
      );
    }
  }
}
