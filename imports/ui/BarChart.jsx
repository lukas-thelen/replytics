import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { Dimensionen } from '../api/twitter_dimensionen.js';
import { Sentiment } from '../api/twitter_sentiment.js';

// const data = {
//
//   };

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

console.log(dimensionen_s_pos);
console.log(dimensionen_s_neu);
console.log(dimensionen_s_neg);


return{
  labels: ["Emotional Appeal", "Products/ Services", "Workplace Environment", "Financial Performance", "Vision/Leadership", "Social/Environmental Responsibility"],
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
        backgroundColor: 'rgba(154,246,154,0.7)'
      },
      {
        label: 'neutral',
        data:  dimensionen_s_neu,
        backgroundColor: "rgba(7, 213, 230, 0.5)"
      },{
        label: 'negativ',
        data:  dimensionen_s_neg,
        backgroundColor: 'rgba(244, 66, 76, 0.7)'
      }
    ]};
  }

  render() {
    if(true) {
      return (
        <div>

          <h5>Sentiment</h5>
          <HorizontalBar
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
              aspectRatio: 3,
              //maintainAspectRatio: false
            }}
            data = {this.getSentiment()}
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
