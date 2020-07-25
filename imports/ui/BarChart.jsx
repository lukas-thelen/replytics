import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
//Import des Charttyps aus react-chart-js-2
import { HorizontalBar } from 'react-chartjs-2';
//Import der Datenbanken
import { Dimensionen } from '../api/twitter_dimensionen.js';
import { Sentiment } from '../api/twitter_sentiment.js';

//Twitter horizontaler Barchart mit Sentiment pro Dimension
export class BarChart extends Tracker.Component {

//Funktion, die das Sentiment der verschiedenen Dimensionen für Twitter berechnet und die Daten für das Chart zurückgibt
  getSentiment(){
    var dimensionen= ["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"]
    var dimensionen_s_pos =[];
    var dimensionen_s_neu =[];
    var dimensionen_s_neg =[];
    var d = Dimensionen.find({username:Meteor.user().username}).fetch()
    if(d[0]){
      for (var i = 0; i< 6; i++){
        dimensionen_s_pos.push(100* d[0][dimensionen[i]].s_pos)
      }
      for (var i = 0; i< 6; i++){
        dimensionen_s_neu.push(100* d[0][dimensionen[i]].s_neu)
      }
      for (var i = 0; i< 6; i++){
        dimensionen_s_neg.push(100* d[0][dimensionen[i]].s_neg)
      }
    }else{
      dimensionen_s_pos =[0,0,0,0,0,0];
      dimensionen_s_neu =[0,0,0,0,0,0];
      dimensionen_s_neg =[0,0,0,0,0,0];
    }

return{
  labels: ["Emotionaler Reiz","Produkt/Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","ges. Verantwortung"],
  datasets:
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
        <h5>Sentiment-Analyse der Kategorien
		<button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier sehen Sie die allgemeine Stimmungslage der Kommentare in der jeweiligen Kategorie. Diese ist unterteilt in positiv, neutral und negativ. So erhalten Sie schnell einen Überblick über welche Kategorie am besten gesprochen wird."><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>

        <div>
          <HorizontalBar className="chartcanvas"
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
