import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import  Tracker  from 'tracker-component';
//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';

//Components
import { KeyFacts } from './KeyFacts.jsx';
import { FollowerVerlauf } from './FollowerVerlauf';
import { Selbstposten } from './posten.jsx';



// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Tracker.Component {
    
  

 
  
  
    
    

    
     render() {
      
       //Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen 
       //Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden
       //if-Bedingung wichtig, um Fehlermeldungen zu vermeiden während die Daten laden
       
        if ( 1==1 ){ //Platzhalter für spätere Bedingungen
           return(

			
		
			
        <div className="row">
			 
			 
				<div className="col-md-5 ">
				<Selbstposten/>
				</div>
		
               <div className="col-md-7 row">
			   Reputation Management Quotient</div>
			   <br></br>
			   <div className="col-md-5 row ">
				
				</div>
				<div className="col-md-7 row "> 
				<KeyFacts/>
               
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