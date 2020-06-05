import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import  Tracker  from 'tracker-component';
//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { MentionCount } from '../api/twitter_mentionCount.js';
//Components
import { KeyFacts } from './KeyFacts.jsx';
import { FollowerVerlauf } from './FollowerVerlauf';



// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Tracker.Component {
    
  

 
  
  getMentions() {
    var mentions = MentionCount.find({}, {sort: {date: -1}}).fetch();
    return mentions;
  }
    
    

    
     render() {
      
       //Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen 
       //Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden
       //if-Bedingung wichtig, um Fehlermeldungen zu vermeiden während die Daten laden
       
        if (this.getMentions()[0] != undefined ){
           return(

             <div>
                
                <KeyFacts 
                  mentionCount={this.getMentions()[0].mentions}
                  mentionAuthors={this.getMentions()[0].authors}                  
                />

              
               
                
                
              </div>
           );
          } else  {

            return (
              <p>  </p>
            );
          }
       
    }
  }
  
  export default App