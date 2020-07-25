import React, { Component } from 'react';
import Tracker from 'tracker-component';
import { Accounts } from '../api/accounts.js';

//Meldung, wenn das Nutzerkonto noch nicht für Twitter autorisiert ist
export class No_Twitter_Dashboard extends Tracker.Component {
    constructor(props){
        super(props);
    }

    //welchselt zur Reddit Seite, wenn eine Autorisierung vorliegt
    componentDidMount=()=>{
        if(this.RedditIsAuthorized() && this.props.firstLoading){ 
            this.props.showReddit()
        }
    }

    //returnt true, wenn für den Nutzer eine Reddit-Autorisierung vorliegt
    RedditIsAuthorized=()=>{
        if(Meteor.user()){
            var nutzer = Meteor.user().username;
            var nutzerdata = Accounts.find({username: nutzer}).fetch()
            console.log(nutzerdata[0])
            if(nutzerdata[0]){
                if(nutzerdata[0].reddit_auth){
                    return true
                }
            }
        }
        return false
      }

  render() {
    if(this.props.renderCondition){  
        return (        
            <div className="text-center" style={{height:"80vh",display:"flex", alignItems:"center", justifyContent: "center", marginTop:"20px"}}> 
                <div>
                    <h1 className="display-4 d-block col-12">Sie haben noch keinen <br/>autorisierten Twitter-Account</h1><br/>
                      unter den Einstellungen in der Navigationsleiste finden Sie den Punkt <br/>"Twitter autorisieren", mit dem Sie ihr Konto verknüpfen können
                </div>
            </div> 
        );
        }else{
            return null
        }
  }
}