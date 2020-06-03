import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import  Tracker  from 'tracker-component';

import { FollowerCount } from '../api/twitter_followerCount.js';


// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Tracker.Component {
    
//PROBLEM: Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen 
// Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden

    
    getTodaysFollower(){
        var follower = [];
        follower = FollowerCount.find({}, {sort: {date: -1}}).fetch();
        return follower[0];
    }
   
     render() {
       if(this.getTodaysFollower() != undefined) {

           return(
                <p> {this.getTodaysFollower().count} </p>
           );
        
       } else {

        return (
          <div>
          <p> Daten werden geladen, bitte warten. </p>
           
           </div>
        );
       }
    }
  }
  
  export default App