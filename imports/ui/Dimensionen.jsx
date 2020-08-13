import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js';
//Import des Charttyps aus react-chart-js-2
import { Radar } from 'react-chartjs-2';
//Import der Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Posts } from '../api/twitter_posts.js';
import { Dimensionen } from '../api/twitter_dimensionen.js';
import ReactTooltip from 'react-tooltip'

//Titter Radarchart mit Engagement und Postanzahl je Dimension
export class DimensionenRadar extends Tracker.Component {

  //Funktion, die die Anzahl der Posts und das Engagement in den jeweiligen Dimensionen für Twitter berechnet und die Daten für das Chart zurückgibt
  getDimension(){
    var nutzer = Meteor.user().username;
    var gesamtPosts = Posts.find({username: nutzer}).fetch().length;
    var dimensionen= ["Emotionen","Produkt und Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision und Führung","Gesellschaftliche Verantwortung"]
    var dimensionen02= ["Emotionen","Produkt_und_Dienstleistung","Arbeitsplatzumgebung","Finanzleistung","Vision_und_Führung","Gesellschaftliche_Verantwortung"]
    var daten = [];
    var count = [];
    var postCount = 0;
    var favorites = 0;
    var engagement = 0;
    var followerSum = [];

  var d = Dimensionen.find({username:nutzer}).fetch()
  if(d[0]){
    for (var i=0; i< 6; i++){
      daten.push(parseInt(d[0][dimensionen02[i]].engagement*100))
      count.push(parseInt(((d[0][dimensionen02[i]].count)/gesamtPosts)*100))
    }
  }else{
    daten = [0,0,0,0,0,0]
    count = [0,0,0,0,0,0]
  }

return {
  labels: ["Emotionaler Reiz", "Produkt/Dienstleitung", "Arbeitsplatzumgebung", "Finanzleistung", "Vision&Führung", "ges. Verantwortung"],
  datasets: [
    {
      label: 'Engagement',
      backgroundColor: 'rgba(92, 184, 92, 0.2)',
      borderColor: 'rgba(92, 184, 92, 0.8)',
      pointBackgroundColor: 'rgba(92, 184, 92, 0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      data: daten
    },
    {
      label: 'Post Count',
      backgroundColor: 'rgba(91, 192, 222, 0.2)',
      borderColor: 'rgb(91, 192, 222)',
      pointBackgroundColor: 'rgb(91, 192, 222)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: count
    }
  ]};
}

  render() {
    return (
      <div>
        <ReactTooltip />
        <h5>Kategorien im Überblick
		<button className="hover btn btn-link alert-light" data-toggle="tooltip" data-tip="Hier werden Ihnen die Anzahl der Posts einer Kategorie, sowie das durchschnittliche Engagement dieser graphisch dargestellt. Auf Grundlage dieser Werte erhalten Sie links Ihre Empfehlungen."><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>
        <div>
        <Radar
        data={this.getDimension()}
        options = {{
            responsive: true
          }} />
        </div>
      </div>
    );
  }
};
