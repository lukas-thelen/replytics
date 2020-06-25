import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { Dimensionen } from '../api/twitter_dimensionen.js';
import { Sentiment } from '../api/twitter_sentiment.js';


export class BarChartGesamt extends Tracker.Component {

  getSentimentGesamt(){
    var dimensionen= ["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"]
    var dimensionen_s_pos =[];
    var dimensionen_s_neu =[];
    var dimensionen_s_neg =[];
    var sentiment_twitter_pos =0;
    var sentiment_twitter_neu =0;
    var sentiment_twitter_neg =0;
    var sentiment_ges = 0;
    var s_twitter_pos = [];
    var s_twitter_neu = [];
    var s_twitter_neg = [];

    for (var i = 0; i< 6; i++){
      dimensionen_s_pos.push(100* Dimensionen.find({username:Meteor.user().username}).fetch()[0][dimensionen[i]].s_pos)
    }
    for (var i = 0; i< 6; i++){
      dimensionen_s_neu.push(100* Dimensionen.find({username:Meteor.user().username}).fetch()[0][dimensionen[i]].s_neu)
    }
    for (var i = 0; i< 6; i++){
      dimensionen_s_neg.push(100* Dimensionen.find({username:Meteor.user().username}).fetch()[0][dimensionen[i]].s_neg)
    }

    for(var i =0; i<6; i++){
      sentiment_ges += dimensionen_s_pos[i] + dimensionen_s_neu[i] + dimensionen_s_neg[i]
      sentiment_twitter_pos += dimensionen_s_pos[i]
      sentiment_twitter_neu += dimensionen_s_neu[i]
      sentiment_twitter_neg += dimensionen_s_neg[i]
    }

    s_twitter_pos.push(100* sentiment_twitter_pos/ sentiment_ges)
    s_twitter_neu.push(100* sentiment_twitter_neu/ sentiment_ges)
    s_twitter_neg.push(100* sentiment_twitter_neg/ sentiment_ges)

console.log(sentiment_ges);

console.log(s_twitter_pos);
console.log(s_twitter_neu);
console.log(s_twitter_neg);

return{
  labels: ["Twitter"],
  datasets:

    [{
      label: 'positiv',
        data :s_twitter_pos,
        backgroundColor: 'rgba(154,246,154,0.7)'
      },
      {
        label: 'neutral',
        data:  s_twitter_neu,
        backgroundColor: "rgba(7, 213, 230, 0.5)"
      },{
        label: 'negativ',
        data:  s_twitter_neg,
        backgroundColor: 'rgba(244, 66, 76, 0.7)'
      }
    ]};
  }

  render() {
    if(true) {
      return (
        <div>

          <h5>Gesamt Sentiment</h5>
          <HorizontalBar
            options = {{
              scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
              },
              responsive: true,
              aspectRatio: 3,
            }}
            data = {this.getSentimentGesamt()}
          />
        </div>

        );
      } else {
        return (
          <p> Daten werden geladen...</p>
        );
      }
    }
  };
