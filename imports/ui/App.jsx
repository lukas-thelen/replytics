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
import { Login } from './Login.jsx';
import { TopPosts} from './TopPosts.jsx';
import { DimensionenRadar } from './Dimensionen.jsx';
import { Settings } from './Settings.jsx';
import { SearchPosts } from './SearchPosts.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Navbar } from './navbar.jsx';
import { Benachrichtigungen } from './Benachrichtigungen.jsx';
import { BarChart } from './BarChart.jsx';
import { BarChartGesamt } from './BarChartGesamt.jsx';




// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Tracker.Component {
  constructor(props){
    super(props);
    this.state = {
      authorize_screen: false,
      settings_screen: false,
      showTop: true,
      showPop: false
    }
    this.twitter_authorization = this.twitter_authorization.bind(this);
    this.goToSettings = this.goToSettings.bind(this)
    this.toTop = this.toTop.bind(this)
    this.toPop = this.toPop.bind(this)
  }

  twitter_authorization(){
    this.setState({authorize_screen: !this.state.authorize_screen})
    this.setState({settings_screen: false})
  }

  goToSettings(){
    this.setState({settings_screen: !this.state.settings_screen})
    this.setState({authorize_screen: false})
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

  toTop(){
    this.setState({showPop:false})
    this.setState({showTop:true})
  }
  toPop(){
    this.setState({showPop:true})
    this.setState({showTop:false})
  }

     render() {

       //Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen
       //Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden
       //if-Bedingung wichtig, um Fehlermeldungen zu vermeiden während die Daten laden
        if ( 1==1 ){ //Platzhalter für spätere Bedingungen
           return(
            <div>
              <Navbar twitter_authorization={this.twitter_authorization} goToSettings={this.goToSettings}/>
              {this.state.authorize_screen && Meteor.user() &&
                <Login twitter_authorization = {this.twitter_authorization} />
              }
              {this.state.settings_screen && 
                <Settings goToSettings={this.goToSettings} />
              }
              
              {Meteor.user() && !this.state.authorize_screen && this.isAuthorized() && !this.state.settings_screen &&
                
                <div className="content row" >
                  
                  <div className="col-xl-4 elem">
                    <Selbstposten/>
                    <Benachrichtigungen/>
                    <br/>
                    <div className="d-flex w-100 justify-content-between " >
                    <h5 style={{display:"inline"}} >bisherige Posts</h5>
                    <span className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                      <button type="button" className="btn " onClick={this.toTop}>Top Posts</button>
                      <button type="button" className="btn " onClick={this.toPop}>Posts suchen</button>
                    </span>
                    </div>
                    <TopPosts renderCondition={this.state.showTop}/>
                    <SearchPosts renderCondition={this.state.showPop}/>
                  </div>

                  <div className="col-xl-8 row">
                  <div className="col-md-6 nopad elem">
                    <DimensionenRadar/>     
                    <br/>
                    <br/>
					<BarChart/>
                    
                  </div>

                    <div className="col-md-6 nopad elem">
                      <KeyFacts/>
                      <br/>
                     
					  <FollowerChart/>
                      <br/>
                       <BarChartGesamt/>
                    </div>
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
