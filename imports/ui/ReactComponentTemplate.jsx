import React, { Component } from 'react';
import Tracker from 'tracker-component';
 

export class ReactComponentTemplate extends Tracker.Component {
 //Platz für neue Funktionen, die innerhalb der Klasse verwendet werden können 
  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
        //alles, was zurück geschickt werden soll
     <div>
        <p> Platz für html Kram </p>
        <p> Einindung von js und den übermittelten Props mit {/*this.props.x*/}</p>
       

     </div>
    );
  }
}