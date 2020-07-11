import React, { Component } from 'react';
import Tracker from 'tracker-component';
 

//Components
import { KeyFacts } from './KeyFacts.jsx';

import { FollowerChart } from './FollowerChart';
import { Selbstposten } from './posten.jsx';
import { TopPosts} from './TopPosts.jsx';
import { DimensionenRadar } from './Dimensionen.jsx';
import { SearchPosts } from './SearchPosts.jsx';
import { Benachrichtigungen } from './Benachrichtigungen.jsx';
import { BarChart } from './BarChart.jsx';
import { BarChartGesamt } from './BarChartGesamt.jsx';
import { Accounts } from '../api/accounts.js';


export class No_Twitter_Dashboard extends Tracker.Component {
    constructor(props){
        super(props);
    }
    componentDidMount=()=>{
        console.log(this.props.firstLoading)
        if(this.RedditIsAuthorized() && this.props.firstLoading){ 
            this.props.showReddit()
        }
    }
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