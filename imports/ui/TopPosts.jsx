import React, { Component } from 'react';
import Tracker from 'tracker-component';

import {Posts} from '../api/twitter_posts.js';
import {FollowerCount} from '../api/twitter_followerCount.js';

export class TopPosts extends Tracker.Component {
	constructor(props){
    super(props)
    this.state = {number: 0}
	
	}

getText() {
	var text = Posts.find({username: Meteor.user().username},{sort:{engagement:-1}}).fetch();
	return text;

}
getEngagement (i) {
	var engagement = this.getText()[i].engagement;
    engagement = parseInt(engagement * 100)
	return engagement;
}

getDate (i) {
	var createdAt = Posts.find({username: Meteor.user().username},{sort:{fav:-1}}).fetch()[i].date;
    var day = createdAt.getDate();
	var month = createdAt.getMonth()+1;
	var year = createdAt.getFullYear();
	var hour = createdAt.getHours();
	var minute = createdAt.getMinutes();
    var dateOutput = day + "." + month + "." + year + " " + hour + ":" + minute;
	return dateOutput;
}
 //Platz für neue Funktionen, die innerhalb der Klasse verwendet werden können 
  render() { 
	  
    //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (


<div>
	{this.getText().length>0 && <div>
	<h5 style={{paddingBottom:6}} className="border-bottom">Top Posts</h5>
	<div style={{paddingBottom:6}} className="border-bottom col-md-12"> 
	<div>
	{/*<small style={{margin:2, fontSize:11, paddingTop:4}}>{this.getText()[0].username}:</small>*/}
	<p style={{margin:2}}>{this.getText()[0].text}</p>
	<p style={{fontSize:10, margin: 2}}>am {this.getDate(0)}</p>
	</div>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-success btn-sm">Engagement:{this.getEngagement(0)} %</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-danger btn-sm">Likes:{this.getText()[0].fav}</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-primary btn-sm">Kommentare: {this.getText()[0].replies.length}</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-warning btn-sm">{this.getText()[0].dimension}</p>
	</div>
	</div>}
    
	{this.getText().length>1 && <div>
	<div style={{paddingBottom:6}}className="border-bottom col-md-12"> 
	<div>
	{/*<p style={{margin:2, fontSize:11,paddingTop:4}}>{this.getText() [0].username}:</p>*/}
	<p style={{margin:2}}>{this.getText()[1].text}</p>
	<p style={{fontSize:10, margin: 2}}>am {this.getDate(1)}</p>
	</div>
	<p className="btn btn-outline-success" style={{height: 18, fontSize: 11, padding: 1, margin: 3}}>Engagement:{this.getEngagement(1)} %</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-danger btn-sm">Likes:{this.getText()[1].fav}</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-primary btn-sm">Kommentare: {this.getText()[1].replies.length}</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-warning btn-sm">{this.getText()[1].dimension}</p>
	</div>
	</div>}

	{this.getText().length>1 && <div>
	<div style={{paddingBottom:6}} className="border-bottom col-md-12"> 
	<div>
	{/*<p style={{margin:2, fontSize:11, paddingTop:4}}>{this.getText() [0].username}:</p>*/}
	<p style={{margin:2}}>{this.getText()[2].text}</p>
	<p style={{fontSize:10, margin: 2}}>am {this.getDate(2)}</p>
	</div>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-success btn-sm">Engagement:{this.getEngagement(2)} %</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-danger btn-sm">Likes:{this.getText()[2].fav}</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-primary btn-sm">Kommentare: {this.getText()[2].replies.length}</p>
	<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-warning btn-sm">{this.getText()[2].dimension}</p>
	</div>
	</div>}

</div>
  )
  }
  

}  

export default TopPosts
