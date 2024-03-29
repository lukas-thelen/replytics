import React, { Component } from 'react';
import Tracker from 'tracker-component';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Accounts } from '../api/accounts.js';


//Navbar - wird immer angezeigt
//dient der Navigation zwischen den Sichten
//viele Funtionen von App.jsx übergeben, um dort einen State zu ändern und eine andere Sicht anzuzeigen
export class Navbar extends Tracker.Component {

    //returnt true, wenn für den Nutzer eine Twitter-Autorisierung vorliegt
    isAuthorized(){
        if(Meteor.user()){
            var nutzer = Meteor.user().username;
            var nutzerdata = Accounts.find({username: nutzer}).fetch()
            if(nutzerdata[0]){
                var token = nutzerdata[0].token;
                if (token){
                    return false
                }
                return true
            }
            return true
        }
    }

    //ändert die Optik des Twitter-Buttons, wenn Twitter angezeigt werden soll
    twitterDesign=()=>{
        if(this.props.twitter){
            return "btn-outline-info btn float-left noHover mr-2"
        }else{
            return "btn-dark btn float-left mr-2"
        } 
    }

    //ändert die Optik des Reddit-Buttons, wenn Reddit angezeigt werden soll
    redditDesign=()=>{
        if(this.props.reddit){
            return "btn-outline-danger btn float-left noHover mr-2"
        }else{
            return "btn-dark btn float-left mr-2"
        } 
    }

    render() {
        return (

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
			<a className="navbar-brand" href="test.html"><img width="90" height="50" src="/logoneu.png" alt="Selfhtml"/></a>
            {/* Buttons, um zwischen Twitter und Reddit zu wechseln */}
            <button ref={(input)=>{this.twitter = input}} className={this.twitterDesign()} onClick={this.props.showTwitter}><img width="35em" height="auto" src="/twitter1.png" alt="Selfhtml"/></button>
			<button ref={(input)=>{this.reddit = input}} className={this.redditDesign()} onClick={this.props.showReddit}><img width="35em" height="auto" src="/Reddit.png" alt="Selfhtml"/></button>


			<div style={{fontSize:14}} className="text-light d-none d-sm-block">...Ihr Weg zum Erfolg!</div>
			<ul className="navbar-nav ml-auto ">
				<button className="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
			</ul>

            {/* Teil der Navbar, der auf kleineren Geräten collapsed */}
			<div className="collapse navbar-collapse " id="navbarTogglerDemo02">
				<ul className="navbar-nav ml-auto">
                    <li className="nav-item active account">
						<span role="navigation"  className="text-light"  style={{fontSize:13}}>
						<strong>Eingeloggt als: </strong>
                        <AccountsUIWrapper />
						</span>
                    </li>
					<li className="nav-item active navelem">
                        {/* Menü mit zusätzlichen Optionen */}
					    <div className="dropdown">
                            <button type="button" className="btn bg-dark text-white dropdown-toggle " id="dropdownSettingsButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                <svg className="bi bi-gear text-light"  width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 014.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 01-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 011.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 012.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 012.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 011.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 01-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 018.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 001.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 00.52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 00-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 00-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 00-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 00-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 00.52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 001.255-.52l.094-.319z" clipRule="evenodd"/>
                                    <path fillRule="evenodd" d="M8 5.754a2.246 2.246 0 100 4.492 2.246 2.246 0 000-4.492zM4.754 8a3.246 3.246 0 116.492 0 3.246 3.246 0 01-6.492 0z" clipRule="evenodd"/>
                                </svg>

                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownSettingsButton">

                                {/* die ersten beiden Optionen sind nur sichtbar, wenn man angemeldet ist */}
                                {Meteor.user() && <a style={{fontSize:14}} className="dropdown-item border-bottom" href="#" onClick={this.props.twitter_authorization}>Twitter autorisieren</a>}
                                {Meteor.user() && <a style={{fontSize:14}} className="dropdown-item border-bottom" href="#" onClick={this.props.goToSettings}>Einstellungen</a>}
                                <a style={{fontSize:14}} className="dropdown-item" href="#" onClick={this.props.goToHelp}>Hilfe</a>

                            </div>

                       </div>
					</li>
					<li className="nav-item navelem">
						<button style={{ fontSize:13}} type="button" className="btn btn-dark text light" disabled>#stayconnected</button>
					</li>
				</ul>
			</div>



                </nav>

        );
    }
}
