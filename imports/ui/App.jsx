import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import  Tracker  from 'tracker-component';

//Datenbanken
import { Accounts } from '../api/accounts.js';

//Components
import { Login } from './Login.jsx';
import { Settings } from './Settings.jsx';
import { Navbar } from './navbar.jsx';
import {Hilfe} from './Hilfe.jsx';
import { Twitter_Dashboard } from './Twitter-Dashboard.jsx';
import { Reddit_Dashboard } from './Reddit_Dashboard.jsx';
import { No_Twitter_Dashboard } from './no_Twitter_Dashboard.jsx';


// App component - represents the whole app -> alle anderen Components hier ausgeben
//wird dann gesammelt an main.js geschickt
export class App extends Tracker.Component {
  constructor(props){
    super(props);
    //variablen im State geben an selche Sicht momentan dargestellt werden soll 
    this.state = {
      authorize_screen: false,
      settings_screen: false,
      help_screen: false,
      twitter: true,
      reddit: false,
      firstLoading: true
    }
    //bindings, um Funktionen auch in Child-Components aufrufen zu können
    this.twitter_authorization = this.twitter_authorization.bind(this);
    this.goToSettings = this.goToSettings.bind(this)
    this.goToHelp = this.goToHelp.bind(this)
    this.showTwitter = this.showTwitter.bind(this)
    this.showReddit = this.showReddit.bind(this)
  }

  //Code aus Suchparametern - wird von Reddit zur Autorisierung angefügt
  code = new URL(window.location.href).searchParams.get('code');

  //ändert State, sodass nur die Seite zur Twitter Autorisierung angezeigt wird oder man zum Dashboard zurückkehrt
  twitter_authorization(){
    this.setState({authorize_screen: !this.state.authorize_screen})
    this.setState({settings_screen: false})
    this.setState({help_screen: false})
  }

  //ändert State, sodass nur die Einstellungs-Seite angezeigt wird oder man zum Dashboard zurückkehrt
  goToSettings(){
    this.setState({settings_screen: !this.state.settings_screen})
    this.setState({authorize_screen: false})
    this.setState({help_screen: false})
  }

  //ändert State, sodass nur die Hilfe-Seite angezeigt wird oder man zum Dashboard zurückkehrt
  goToHelp(){
    this.setState({help_screen: !this.state.help_screen})
    this.setState({settings_screen: false})
    this.setState({authorize_screen: false})
  }

  //returnt true, wenn für den Nutzer eine Twitter-Autorisierung vorliegt
  isAuthorized=()=>{
      if(Meteor.user()){
          var nutzer = Meteor.user().username;
          var nutzerdata = Accounts.find({username: nutzer}).fetch()
          if(nutzerdata[0]){
              if(nutzerdata[0].token){
                  return true
              }
          }     
      }
      return false  
  }

  //returnt true, wenn für den Nutzer eine Reddit-Autorisierung vorliegt
  RedditIsAuthorized=()=>{
    if(Meteor.user()){
        var nutzer = Meteor.user().username;
        var nutzerdata = Accounts.find({username: nutzer}).fetch()
        if(nutzerdata[0]){
            if(nutzerdata[0].reddit_auth){
                return true
            }
        }
    }
    return false
  }

  //ändert State, sodass das Twitter-Dashboard angezeigt wird
  showTwitter(){
    console.log(this.state.firstLoading)
    this.setState({firstLoading: false})
    this.setState({reddit:false})
    this.setState({twitter:true})
    this.setState({settings_screen: false})
    this.setState({authorize_screen: false})
    this.setState({help_screen: false})
  }

  //ändert State, sodass das Reddit-Dashboard angezeigt wird
  showReddit(){
    this.setState({reddit:true})
    this.setState({twitter:false})
    this.setState({settings_screen: false})
    this.setState({authorize_screen: false})
    this.setState({help_screen: false})
  }
  
  //speichert den Reddit Requester in den Accounts Datenbank (wenn man von Reddit zurückgeleitet wird) 
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

  //returnt true, wenn der Nutzer in der Accounts Datenbank existiert
  accountsExists =()=>{
    if(Meteor.user()){
      var acc = Accounts.find({username:Meteor.user().username}).fetch()
      if(acc[0]){
        return true
      }
      return false
    }
  }

  //erstellt einen Eintrag in der Accounts DB 
  skipVideo=()=>{
    Accounts.insert({
      owner: Meteor.userId(),
      username: Meteor.user().username
    })
  }

     render() {

       //Zugriff auf Datenbank ist langsamer als Aufruf der ganzen Funktionen
       //Rendern muss verzögert werden oder Platzhalter durch automatische updates ausgetauscht werden
       //if-Bedingung wichtig, um Fehlermeldungen zu vermeiden während die Daten laden
        if ( true ){ //Platzhalter für spätere Bedingungen
           return(
            <div>
              {/* Navbar Component - bekommt verschiedene Funktionen und Werte übergeben */}
              <Navbar twitter_authorization={this.twitter_authorization} goToSettings={this.goToSettings} goToHelp={this.goToHelp} 
                showReddit={this.showReddit} showTwitter={this.showTwitter} twitter={this.state.twitter} reddit={this.state.reddit}/>

              <div className="main">

                {/* Login Component - wird nur angezeigt wenn State = true - bekommt Funktion übergeben, um zum Dashboard zurückzukehren - gleiches gilt für die folgenden 2 Components*/}
                {this.state.authorize_screen && Meteor.user() && this.accountsExists() && 
                  <Login twitter_authorization = {this.twitter_authorization} />
                }

                {this.state.settings_screen && Meteor.user() && this.accountsExists() &&
                  <Settings goToSettings={this.goToSettings} />
                }

                {this.state.help_screen &&
                  <Hilfe goToHelp={this.goToHelp} />
                }


                {/* Hinweistext - wird angezeigt, wenn man nicht angemeldet ist und sich nicht auf einer anderen Sicht befindet */}
                {!Meteor.user() && !this.state.settings_screen && !this.state.help_screen &&
                  <div className="text-center" style={{height:"80vh",display:"flex", alignItems:"center", justifyContent: "center", marginTop:"20px"}}> 
                    <div>
                    <h1 className="display-4 d-block col-12">Sie sind nicht angemeldet</h1><br/>
                    Nutzen Sie die Anmeldefunktion in der Navigationsleiste, <br/> um sich anzumelden oder einen neuen Account zu erstellen.
                    </div>
                  </div> 
                }


                {/* Video, das angezeigt wird, wenn man sich zum ersten Mal anmeldet(noch kein Eintrag in der Accounts DB besteht) - dieser wird bei Klick auf Button eerstellt-> Video wird nie mehr angezeigt*/}
                {Meteor.user() && !this.accountsExists() && 
                <div className="text-center" style={{height:"80vh",display:"flex", alignItems:"center", justifyContent: "center", marginTop:"20px"}}>
                  <div>
                    <div>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/DP4_CfcHrhU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="allowFullScreen"></iframe>
                    </div>
                  <button className="btn-secondary btn" onClick={this.skipVideo}> Weiter </button>
                  </div>
                </div>
                }

                {/* Alert, wenn man von Reddit zurückgeleitet wird - muss bestätigt werden, um einrichtung abzuschließen - nur gerendert, wenn Code in den Suchparametern */}
                {this.code &&
                <div className="alert alert-success mt-2 pl-3" role="alert">
                  Reddit Einrichtung bestätigen:
                  <button className="btn btn-sm btn-light" onClick={this.saveReddit}> OK </button>
                </div>}

                {/* eigentliche Dashboards - werden nur gerendert, wenn keine andere Sicht angezeigt werden soll - alternative Anzeigen, wenn noch keine Autorisierung besteht*/}
                {Meteor.user() && this.accountsExists() && !this.state.authorize_screen && this.isAuthorized() && !this.state.settings_screen && !this.state.help_screen &&  
                  
                  <Twitter_Dashboard renderCondition={this.state.twitter} showReddit={this.showReddit}/>
                }
                {Meteor.user() && this.accountsExists() && !this.state.authorize_screen && !this.isAuthorized() && !this.state.settings_screen && !this.state.help_screen && this.state.twitter &&
                  
                  <No_Twitter_Dashboard renderCondition={this.state.twitter} firstLoading={this.state.firstLoading} showReddit={this.showReddit}/>
                }
                {Meteor.user() && this.accountsExists() && !this.state.authorize_screen && this.RedditIsAuthorized() && !this.state.settings_screen && !this.state.help_screen &&  
                  
                  <Reddit_Dashboard renderCondition={this.state.reddit}/>
                }
                {Meteor.user() && this.accountsExists() && !this.state.authorize_screen && !this.RedditIsAuthorized() && !this.state.settings_screen && !this.state.help_screen && this.state.reddit &&
                  
                  <div className="text-center" style={{height:"80vh",display:"flex", alignItems:"center", justifyContent: "center", marginTop:"20px"}}> 
                    <div>
                    <h1 className="display-4 d-block col-12">Sie haben noch keinen <br/>autorisierten Reddit-Account</h1><br/>
                      unter dem Punkt "Einstellungen" in der Navigationsleiste <br/>finden Sie einen Button, mit dem Sie ihr Konto verknüpfen können
                    </div>
                  </div>
                }

              {/* Footer mit Kontaktinfo */}
              </div>
              <div className="footer-copyright text-center py-3 footer bg-dark footer mt-auto">© 2020 Copyright:
			          <a href="https://connected-organization.de/"> Connected-organisation.de</a>
			          <div className="kontakt">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-envelope" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                  </svg> &nbsp; bei Fragen schreiben Sie uns gerne an unter : info@connected-organization.de
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
