import React, { Component } from 'react';
import Tracker from 'tracker-component';
import { TwitterAPI } from '../api/twitter_credentials.js';
import { Popular } from '../api/twitter_popular.js';
 

export class SearchPosts extends Tracker.Component {
    constructor () {
        super();
    
        this.state = {
          text: ""
        };
    }

    changeText = (event) => {
        event.preventDefault()
        this.setState({text: event.target.value});
    }

    suchen =(event)=>{
        event.preventDefault()
        Meteor.call('searchPosts', Meteor.user().username, this.state.text)
        event.target.reset()
    }
    getTweets=()=>{
        var posts = Popular.find({username:Meteor.user().username}).fetch()
		if(posts[0]){
			return posts[0].posts
		}
		return []
    }
    getDate (createdAt) {
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

  render() {

      const Posts = this.getTweets().map((post)=>
	    
        <div style={{margin:3}}className="border-bottom col-md-12">
			<div className="d-flex w-100 justify-content-between ">
			<strong style={{fontSize:11}}>{post.autor}</strong>
			<span style={{fontSize:10, margin: 2}}>{this.getDate(post.date)}</span>
			</div>
			<div className="d-flex w-100 justify-content-between ">
            <a className="alert alert-light" href={post.link} target="_blank" style={{margin:2, fontSize:13}}>{post.text}</a><br/>
            
			<span style={{height: 18, fontSize: 11, padding: 1,paddingLeft:2, paddingRight: 2, margin: 15}}className="btn btn-outline-danger btn-sm"> Likes:{post.favorites}</span>
			</div>
			
            
        </div>
      );
    if(this.props.renderCondition){  
    return (
        //alles, was zurück geschickt werden soll
        <div style={{marginTop:6}}>
        <form onSubmit={ this.suchen } className="form-inline">
		    <input style={{height: 25, fontSize: 15, padding: 4, margin: 3}} className="form-control mr-sm-2 button-xs" type="suchen" placeholder="Suchbegriff eingeben" aria-label="Search" type="text" onChange={this.changeText}></input>
            <input style={{height: 25, fontSize: 11, padding: 4, margin: 3}} className="btn btn-outline-secondary my-2 my-sm-0 button-xs" type="submit" value="Suchen"></input>
        </form>
        <div>{Posts}</div>
        </div>
    );
    }else{
        return null
    }
  }
}