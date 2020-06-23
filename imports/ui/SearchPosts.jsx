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
        return posts[0].posts
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
        <div>
            <a href={post.link} target="_blank">{post.text}</a><br/>
            <span>{post.autor}</span>
            <span>{this.getDate(post.date)}</span>
            <span> {post.favorites}</span>
        </div>
      );
    return (
        //alles, was zurück geschickt werden soll
        <div>
        <form onSubmit={ this.suchen }>
		    <input type="text" onChange={this.changeText}></input>
            <input type="submit"></input>
        </form>
        <div>{Posts}</div>
        </div>
    );
  }
}