//KOMMENTIERT
import React, { Component } from 'react';
import Tracker from 'tracker-component';
import {Reddit_Posts} from '../api/reddit_posts.js';
import {FollowerCount} from '../api/twitter_followerCount.js';

export class Reddit_TopPosts extends Tracker.Component {
	constructor(props){
    super(props)
    this.state = {number: 0}
	
	}
//Zugriff auf Datenbank
getText() {
	var text = Reddit_Posts.find({username: Meteor.user().username},{sort:{engagement:-1}}).fetch();
	return text;

}
//Zugriff auf Engagement Wert
getEngagement (i) {
	var engagement = this.getText()[i].engagement;
    engagement = parseInt(engagement * 100)
	return engagement;
}
//Datum lesbar machen
getDate (i) {
	var createdAt = this.getText()[i].date;
    var day = createdAt.getDate();
	var month = createdAt.getMonth()+1;
	var year = createdAt.getFullYear();
	var hour = createdAt.getHours();
	var minute = createdAt.getMinutes();
	if(minute<10){
		minute="0"+minute
	}
    var dateOutput = day + "." + month + "." + year + " " + hour + ":" + minute;
	return dateOutput;
}

//Darstellung auf dem Dashboard
  render() { 
	  
	
	if(this.props.renderCondition){
    return (

		<div>
			{this.getText().length>0 && <div>
			<div style={{paddingBottom:6}} className="border-bottom col-md-12"> 
			<div className="d-flex w-100 justify-content-between ">
			<strong style={{margin:2, fontSize:11}}>{this.getText()[0].username}</strong>
			<span style={{fontSize:10, margin: 2}}>{this.getDate(0)}</span>
			</div>
			<div className="d-flex w-100 justify-content-between ">
			<span style={{margin:2,fontSize:14}}>{this.getText()[0].text}</span>
			</div>
			
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-dark btn-sm">Engagement: {this.getEngagement(0)} %</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-success btn-sm">Upvotes: {this.getText()[0].ups}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-danger btn-sm">Downvotes: {this.getText()[0].downs}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-info btn-sm">Kommentare: {this.getText()[0].num_replies}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-secondary btn-sm">{this.getText()[0].dimension}</p>
			</div>
			</div>}
			
			{this.getText().length>1 && <div>
			<div style={{paddingBottom:6}}className="border-bottom col-md-12"> 
			<div className="d-flex w-100 justify-content-between ">
			<strong style={{margin:2, fontSize:11}}>{this.getText()[0].username}</strong>
			<span style={{fontSize:10, margin: 2}}>{this.getDate(1)}</span>
			</div>
			<div className="d-flex w-100 justify-content-between ">
			<span style={{margin:2, fontSize:14}}>{this.getText()[1].text}</span>
			</div>
			<p className="btn btn-outline-dark btn-sm" style={{height: 18, fontSize: 11, padding: 1, margin: 3}}>Engagement: {this.getEngagement(1)} %</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-success btn-sm">Upvotes: {this.getText()[1].ups}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-danger btn-sm">Downvotes: {this.getText()[1].downs}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-info btn-sm">Kommentare: {this.getText()[1].num_replies}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-secondary btn-sm">{this.getText()[1].dimension}</p>
			</div>
			</div>}

			{this.getText().length>2 && <div>
			<div style={{paddingBottom:6}} className="border-bottom col-md-12"> 
			<div className="d-flex w-100 justify-content-between ">
			<strong style={{margin:2, fontSize:11}}>{this.getText()[0].username}</strong>
			<span style={{fontSize:10, margin: 2}}>{this.getDate(2)}</span>
			</div>
			<div className="d-flex w-100 justify-content-between ">
			<a style={{margin:2, fontSize:14}}>{this.getText()[2].text}</a>
			</div>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-dark btn-sm">Engagement: {this.getEngagement(2)} %</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-success btn-sm">Upvotes: {this.getText()[2].ups}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-danger btn-sm">Downvotes: {this.getText()[2].downs}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-info btn-sm">Kommentare: {this.getText()[2].num_replies}</p>
			<p style={{height: 18, fontSize: 11, padding: 1, margin: 3}}className="btn btn-outline-secondary btn-sm">{this.getText()[2].dimension}</p>
			</div>
			</div>}

		</div>
  )
	}else{
		return null
	}
  }
  

}  

export default Reddit_TopPosts
