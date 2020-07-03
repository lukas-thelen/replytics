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





// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
class App extends Tracker.Component {
  constructor(props){
    super(props);
    this.state = {
      authorize_screen: false,
      settings_screen: false,
      help_screen: false,
      showTop: true,
      showPop: false
    }
    this.twitter_authorization = this.twitter_authorization.bind(this);
    this.goToSettings = this.goToSettings.bind(this)
    this.goToHelp = this.goToHelp.bind(this)
    this.toTop = this.toTop.bind(this)
    this.toPop = this.toPop.bind(this)
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
              <Navbar twitter_authorization={this.twitter_authorization} goToSettings={this.goToSettings} goToHelp={this.goToHelp}/>
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

                <div className="content row" >

                  <div className="col-xl-5 elem erste">
                    
                    
                    <Selbstposten/>
					<Benachrichtigungen/>
                    <br/>
                    <div className="d-flex w-100 justify-content-between " >
                      <h5 style={{display:"inline"}} >Post-Analyse
                        <button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier erhalten Sie einen Überblick über Ihre erfolgreichsten Posts des letzten Monats. Entsprechende Statistiken finden Sie in Kurzform darunter. Wenn Sie den Button rechts auf Posts suchen umstellen, bekommen Sie die Möglichkeit die besten Posts zu Ihrem entsprechenden Schlagwort zu sehen. "><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                      </svg></button></h5>
					  
                      <span className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                        <button type="button" className="btn " onClick={this.toTop}>Top Posts</button>
                        <button type="button" className="btn " onClick={this.toPop}>Posts suchen</button>
                      </span>
                    </div>
                    <TopPosts renderCondition={this.state.showTop}/>
                    <SearchPosts renderCondition={this.state.showPop}/>
                  </div>

                  <div className="col-xl-7 row">
                    <div className="col-md-6 elem zweite">
                     
					            <DimensionenRadar/>
                      <br/>
                      <br/>
					            <BarChart/>
					        

					          </div>
                    <div className="col-md-6 elem dritte">
                      <KeyFacts/>
                      <br/>
					            <FollowerChart/>
                      <br/>
                      <BarChartGesamt/>
					            <br/>
					          </div>
                  </div>
                  <div className="footer-copyright text-center py-3 footer bg-dark ">© 2020 Copyright:
			              <a href="https://mdbootstrap.com/"> Replytics.com</a>
			              <div className="kontakt">
			                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-telephone-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			                  <path fillRule="evenodd" d="M2.267.98a1.636 1.636 0 0 1 2.448.152l1.681 2.162c.309.396.418.913.296 1.4l-.513 2.053a.636.636 0 0 0 .167.604L8.65 9.654a.636.636 0 0 0 .604.167l2.052-.513a1.636 1.636 0 0 1 1.401.296l2.162 1.681c.777.604.849 1.753.153 2.448l-.97.97c-.693.693-1.73.998-2.697.658a17.47 17.47 0 0 1-6.571-4.144A17.47 17.47 0 0 1 .639 4.646c-.34-.967-.035-2.004.658-2.698l.97-.969z"/>
			                </svg> &nbsp; bei Fragen rufen sie uns einfach an unter : 08001233477 </div>
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
