import React, { Component } from 'react';
import Tracker from 'tracker-component';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Accounts } from '../api/accounts.js';
 

export class Navbar extends Tracker.Component {
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
    render() {
        //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:'#A9F5F2'}}>
                    <a className="navbar-brand" href="test.html"><img width="150" height="100" src="/MicrosoftTeams-image.png" alt="Selfhtml"/></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item active">
                                <a className="nav-link" href="http://www.instagram.de"><img width="50em" height="auto" src="/instagram.ico" alt="Selfhtml"/><span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="http://www.twitter.com"><img width="50em" height="auto" src="/Twitter.ico" alt="Selfhtml"/></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="http://de.linkedin.com"><img width="58em" height="auto" src="/linkedin.ico" alt="Selfhtml"/></a>
                            </li>
                        </ul>
                    

                        <AccountsUIWrapper />
                        <div className="dropdown">
                            <button type="button" className="btn btn-secondary dropdown-toggle" id="dropdownNotificationsButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{backgroundColor: '#A9F5F2', borderColor: '#A9F5F2'}}>
                                <svg className="bi bi-bell" width="2em" height="2em" viewBox="0 0 16 16" style={{color: '#000000'}} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 16a2 2 0 002-2H6a2 2 0 002 2z"/>
                                    <path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 004 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 00-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 111.99 0A5.002 5.002 0 0113 6c0 .88.32 4.2 1.22 6z" clipRule="evenodd"/>
                                </svg> 
                                <span className="badge badge-light" style={{backgroundColor: '#cd5c5c', color: '#ffffff'}}>3</span>
                                <span className="sr-only">unread messages</span>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownNotificationsButton">
                                <a className="dropdown-item" href="#">Post ist kacke</a>
                                <a className="dropdown-item" href="#">Viele Likes auf Twitter</a>
                                <a className="dropdown-item" href="#">Zu wenig Instagram Aktivität</a>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button type="button" className="btn btn-secondary dropdown-toggle" id="dropdownSettingsButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{backgroundColor: '#A9F5F2', borderColor: '#A9F5F2'}}>
                                <svg className="bi bi-gear" style={{color: '#000000'}} width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 014.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 01-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 011.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 012.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 012.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 011.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 01-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 018.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 001.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 00.52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 00-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 00-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 00-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 00-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 00.52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 001.255-.52l.094-.319z" clipRule="evenodd"/>
                                    <path fillRule="evenodd" d="M8 5.754a2.246 2.246 0 100 4.492 2.246 2.246 0 000-4.492zM4.754 8a3.246 3.246 0 116.492 0 3.246 3.246 0 01-6.492 0z" clipRule="evenodd"/>
                                </svg>
                                <span className="sr-only">unread messages</span>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownSettingsButton">
                                {this.isAuthorized() && <a className="dropdown-item" href="#" onClick={this.props.twitter_authorization}>Twitter autorisieren</a>}
                                <a className="dropdown-item" href="#">ausloggen</a>
                            </div>
                        </div>

                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" style={{marginLeft: 20}} type="search" placeholder="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>            
                            {/*<a href="profile.html"><img style={{marginLeft: 20}} src="/Profilbild.jpg" alt="Avatar" className="avatar"/></a>*/}                
                    </div>
                </nav>
            </div>
        );
    }
}