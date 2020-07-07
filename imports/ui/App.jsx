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

import {Hilfe} from './Hilfe.jsx';
import { Reddit_Login } from './reddit_Login.jsx';

import {Reddit_TopPosts } from './Reddit_TopPosts.jsx';
import {Subreddit_TopPosts } from './Subreddit_TopPosts.jsx';
import {Reddit_Benachrichtigungen } from './Reddit_Benachrichtigungen.jsx';
import { Twitter_Dashboard } from './Twitter-Dashboard.jsx';
import { Reddit_Dashboard } from './Reddit_Dashboard.jsx';


import { RedditSelbstposten } from './reddit_posten.jsx';
import { Reddit_Dimensionen } from '../api/reddit_dimensionen.js';
import { RedditBarChart } from './RedditBarChart.jsx';
import { Reddit_SubscriberCount } from '../api/reddit_subscriberCount.js';
import { RedditBarChartGesamt } from './RedditBarChartGesamt.jsx';


// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
export class App extends Tracker.Component {
  constructor(props){
    super(props);
    this.state = {
      authorize_screen: false,
      settings_screen: false,
      help_screen: false,
      showTop: true,
      showPop: false,
      twitter: true,
      reddit: false
    }
    this.twitter_authorization = this.twitter_authorization.bind(this);
    this.goToSettings = this.goToSettings.bind(this)
    this.goToHelp = this.goToHelp.bind(this)
    this.showTwitter = this.showTwitter.bind(this)
    this.showReddit = this.showReddit.bind(this)
  }
  
  code = new URL(window.location.href).searchParams.get('code');

  twitter_authorization(){
    this.setState({authorize_screen: !this.state.authorize_screen})
    this.setState({settings_screen: false})
    this.setState({help_screen: false})
  }

  goToSettings(){
    this.setState({settings_screen: !this.state.settings_screen})
    this.setState({authorize_screen: false})
    this.setState({help_screen: false})
  }
  goToHelp(){
    this.setState({help_screen: !this.state.help_screen})
    this.setState({settings_screen: false})
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
  RedditIsAuthorized(){
    var nutzer = Meteor.user().username;
    var nutzerdata = Accounts.find({username: nutzer}).fetch()
    if(nutzerdata[0]){
      return nutzerdata[0].reddit_auth
    }
    return false
  }

  showTwitter(){
    this.setState({reddit:false})
    this.setState({twitter:true})
    this.setState({settings_screen: false})
    this.setState({authorize_screen: false})
    this.setState({help_screen: false})
  }
  showReddit(){
    this.setState({reddit:true})
    this.setState({twitter:false})
    this.setState({settings_screen: false})
    this.setState({authorize_screen: false})
    this.setState({help_screen: false})
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
              <Navbar twitter_authorization={this.twitter_authorization} goToSettings={this.goToSettings} goToHelp={this.goToHelp} 
                showReddit={this.showReddit} showTwitter={this.showTwitter} twitter={this.state.twitter} reddit={this.state.reddit}/>
              <div className="main">
                {this.state.authorize_screen && Meteor.user() &&
                  <Login twitter_authorization = {this.twitter_authorization} />
                }
                {this.state.settings_screen &&
                  <Settings goToSettings={this.goToSettings} />
                }
                {this.state.help_screen &&
                  <Hilfe goToHelp={this.goToHelp} />
                }


                {this.code &&
                <div className="alert alert-success mt-2 pl-3" role="alert">
                  Reddit Einrichtung bestätigen:
                  <button className="btn btn-sm btn-light" onClick={this.saveReddit}> OK </button>
                </div>}
                {Meteor.user() && !this.state.authorize_screen && this.isAuthorized() && !this.state.settings_screen && !this.state.help_screen &&  
                  
                  <Twitter_Dashboard renderCondition={this.state.twitter}/>
                }
                {Meteor.user() && !this.state.authorize_screen && this.RedditIsAuthorized() && !this.state.settings_screen && !this.state.help_screen &&  
                  
                  <Reddit_Dashboard renderCondition={this.state.reddit}/>
                }
              </div>
              <div className="footer-copyright text-center py-3 footer bg-dark footer mt-auto">© 2020 Copyright:
			          <a href="https://mdbootstrap.com/">Replytics.com</a>
			          <div className="kontakt">
			            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-telephone-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			              <path fillRule="evenodd" d="M2.267.98a1.636 1.636 0 0 1 2.448.152l1.681 2.162c.309.396.418.913.296 1.4l-.513 2.053a.636.636 0 0 0 .167.604L8.65 9.654a.636.636 0 0 0 .604.167l2.052-.513a1.636 1.636 0 0 1 1.401.296l2.162 1.681c.777.604.849 1.753.153 2.448l-.97.97c-.693.693-1.73.998-2.697.658a17.47 17.47 0 0 1-6.571-4.144A17.47 17.47 0 0 1 .639 4.646c-.34-.967-.035-2.004.658-2.698l.97-.969z"/>
			            </svg> &nbsp; bei Fragen rufen sie uns einfach an unter : 08001233477 
                </div>
			        </div>
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
