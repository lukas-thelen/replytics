import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { Dimensionen } from '../api/twitter_dimensionen.js';
import { Sentiment } from '../api/twitter_sentiment.js';


export class BarChart extends Tracker.Component {

  getSentiment(){
    var dimensionen= ["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"]
    var dimensionen_s_pos =[];
    var dimensionen_s_neu =[];
    var dimensionen_s_neg =[];
    for (var i = 0; i< 6; i++){
      dimensionen_s_pos.push(100* Dimensionen.find({username:Meteor.user().username}).fetch()[0][dimensionen[i]].s_pos)
    }
    for (var i = 0; i< 6; i++){
      dimensionen_s_neu.push(100* Dimensionen.find({username:Meteor.user().username}).fetch()[0][dimensionen[i]].s_neu)
    }
    for (var i = 0; i< 6; i++){
      dimensionen_s_neg.push(100* Dimensionen.find({username:Meteor.user().username}).fetch()[0][dimensionen[i]].s_neg)
    }

return{
  labels: ["Emotionen","Produkt/Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","ges. Verantwortung"],
  datasets:
    /*{
      label: 'Sentiment',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    },*/
    [{
      label: 'positiv',
        data :dimensionen_s_pos,
        backgroundColor: 'rgba(92, 184, 92, 0.6)',
        barThickness:20
      },
      {
        label: 'neutral',
        data:  dimensionen_s_neu,
        backgroundColor: "rgba(91, 192, 222, 0.6)",
        barThickness:20
      },{
        label: 'negativ',
        data:  dimensionen_s_neg,
        backgroundColor: 'rgba(217, 83, 79, 0.6)',
        barThickness:20
      }
    ]};
  }

  render() {
    if(true) {
      return (
        <div className="barchart">
        <h5>Sentiment</h5>

        <div>
          <HorizontalBar className="chartcanvas"
            options = {{
            //  bezierCurve: false,
              //linetension: 0,
              //scales: {yAxes: [{ticks: {suggestedMin: 0}}]},
              scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
              },
              responsive: true,
              maintainAspectRatio: false
            }}
            data = {this.getSentiment()}
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
};
