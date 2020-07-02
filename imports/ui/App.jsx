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
import { Reddit_Login } from './reddit_Login.jsx';




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
  
  code = new URL(window.location.href).searchParams.get('code');

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
  saveReddit=async()=>{
    var name = Meteor.user().username;
    var userExists = Accounts.find({username: name}).fetch()
    if(!userExists[0]){
      let test02 = await Accounts.insert({
        owner: Meteor.userId(),
        username: Meteor.user().username,
        reddit_auth: true, 
        reddit_code: this.code
      })
    }else{
    let wait = await Meteor.callPromise("reddit_requester", name, this.code)
    }
    window.location = "http://localhost:3000"
  }

     render() {

       //Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen
       //Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden
       //if-Bedingung wichtig, um Fehlermeldungen zu vermeiden während die Daten laden
        if ( true ){ //Platzhalter für spätere Bedingungen
           return(
            <div>
              <Navbar twitter_authorization={this.twitter_authorization} goToSettings={this.goToSettings}/>
              {this.state.authorize_screen && Meteor.user() &&
                <Login twitter_authorization = {this.twitter_authorization} />
              }
              {this.state.settings_screen && 
                <Settings goToSettings={this.goToSettings} />
              }
              {this.code &&
              <div className="alert alert-success mt-2 pl-3" role="alert">
                Reddit Einrichtung bestätigen:
                <button className="btn btn-sm btn-light" onClick={this.saveReddit}> OK </button>
              </div>}
              {Meteor.user() && !this.state.authorize_screen && this.isAuthorized() && !this.state.settings_screen && 
                <div className="row">
                  
                  <div className="col-md-5 ">
                    <Selbstposten/>
                    <br/>
                    <Benachrichtigungen/>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-secondary" onClick={this.toTop}>Top Posts</button>
                      <button type="button" className="btn btn-secondary" onClick={this.toPop}>Posts suchen</button>
                    </div>
                    <TopPosts renderCondition={this.state.showTop}/>
                    <SearchPosts renderCondition={this.state.showPop}/>
                  </div>
          
                  <div className="col-md-7">
                    <DimensionenRadar/>
                    <BarChart/>
                    <br/>
                    <div className="col-md-2 row ">
                      <KeyFacts/>

                    </div>
                    <div className="col-md-5 row">
                      <BarChartGesamt/>
                      <FollowerChart/>
                    </div>
                  
                  </div>

                </div>
              }
            </div>

           );
          }else{

            return(
            <div></div>
            );
          }

    }
  }

  export default App
