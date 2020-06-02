import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {Tracker } from 'tracker-component';

import { FollowerCount } from '../api/twitter_followerCount.js';


// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Component {
    
//PROBLEM: Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen 
// Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden

    
    getFollower(){
        setTimeout(() => {
            var follower = FollowerCount.find({}).fetch();
            console.log(follower)
            return follower;
        }, 2000);
        
    }
   
     render() {
        if(this.getFollower() != undefined) {
            return (
                <div className="container">
                  <header>
                    <h1>FollowerCount </h1>
                  </header>
           
                  <ul>
                    {this.getFollower()[0].count}
                  </ul>
                  <ul>
                    
                  </ul>
                </div>
            );
        } else {
           return(
                <p> Daten werden geladen </p>
           );
        }
    }
  }
  
  export default App