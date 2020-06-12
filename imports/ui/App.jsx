import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import  Tracker  from 'tracker-component';
//Datenbanken
import { FollowerCount } from '../api/twitter_followerCount.js';
import { Accounts } from '../api/accounts.js';

//Components
import { KeyFacts } from './KeyFacts.jsx';

import { FollowerChart } from './FollowerChart';
import { Selbstposten } from './posten.jsx';
import { Login } from './Login.jsx'

import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Navbar } from './navbar.jsx';




// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Tracker.Component {
  constructor(props){
    super(props);
    this.state = {
      authorize_screen: false
    }
    this.twitter_authorization = this.twitter_authorization.bind(this)
  }

  twitter_authorization(){
    this.setState({authorize_screen: !this.state.authorize_screen})
  }

  isAuthorized(){
    if(Meteor.user()){
        var nutzer = Meteor.user().username;
        var nutzerdata = Accounts.find({username: nutzer}).fetch()
        if(nutzerdata[0]){
            var token = nutzerdata[0].token;
            if (token){
                return true
            }
            return false
        }
        return false
    }
}
     render() {

       //Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen
       //Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden
       //if-Bedingung wichtig, um Fehlermeldungen zu vermeiden während die Daten laden

        if ( 1==1 ){ //Platzhalter für spätere Bedingungen
           return(
            <div>
              <Navbar twitter_authorization = {this.twitter_authorization}/>
              {this.state.authorize_screen && Meteor.user() && <Login twitter_authorization = {this.twitter_authorization} />}
              {Meteor.user() && !this.state.authorize_screen && this.isAuthorized() &&
                <div className="row">
                  
                  <div className="col-md-5 ">
                    <Selbstposten/>
                  </div>
          
                  <div className="col-md-7 row">
                    Repu</div>
                    <br></br>
                  <div className="col-md-5 row ">

                  </div>
                  <div className="col-md-2 row ">
                    <KeyFacts/>

                  </div>
                  <div className="col-md-5 row ">

                    <FollowerChart/>
                  </div>
                  
                </div>
              }
            </div>

           );
          }else{

            return(
              <p>  </p>
            );
          }

    }
  }

  export default App
