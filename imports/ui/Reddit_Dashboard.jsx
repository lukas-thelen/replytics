import React, { Component } from 'react';
import Tracker from 'tracker-component';
 

//Components
import { KeyFacts } from './KeyFacts.jsx';
import { RedditSelbstposten } from './reddit_posten.jsx';
import { Reddit_Benachrichtigungen } from './Reddit_Benachrichtigungen.jsx';
import { Reddit_TopPosts } from './Reddit_TopPosts.jsx';
import { Subreddit_TopPosts } from './Subreddit_TopPosts.jsx';
import { RedditBarChart } from './RedditBarChart.jsx';
import { RedditBarChartGesamt } from './RedditBarChartGesamt.jsx';
import { RedditSubscriberChart } from './RedditSubscriberChart.jsx';
import { RedditDimensionenRadar } from './RedditDimensionen.jsx';


export class Reddit_Dashboard extends Tracker.Component {
    constructor(props){
        super(props);
        this.state = {
          showTop: true,
          showPop: false
        }
        this.toTop = this.toTop.bind(this)
        this.toPop = this.toPop.bind(this)
    }

    toTop(){
        this.setState({showPop:false})
        this.setState({showTop:true})
    }
    toPop(){
        this.setState({showPop:true})
        this.setState({showTop:false})
    }
  render() {
    if(this.props.renderCondition){
        return (

            <div className="content row" >

                <div className="col-xl-5 elem erste">                             
                    <RedditSelbstposten/>
                    <Reddit_Benachrichtigungen/>
                    <br/>
                    <div className="d-flex w-100 justify-content-between " >
                        <h5 style={{display:"inline"}} >Post-Analyse
                        <button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier erhalten Sie einen Überblick über Ihre erfolgreichsten Posts des letzten Monats. Entsprechende Statistiken finden Sie in Kurzform darunter. Wenn Sie den Button rechts auf Posts suchen umstellen, bekommen Sie die Möglichkeit die besten Posts zu Ihrem entsprechenden Schlagwort zu sehen. "><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                        </svg></button></h5>
                        
                        <span className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                            <button type="button" className="btn " onClick={this.toTop}>Meine Posts</button>
                            <button type="button" className="btn " onClick={this.toPop}>Top im Subreddit</button>
                        </span>
                    </div>
                        <Reddit_TopPosts renderCondition={this.state.showTop}/>
                        <Subreddit_TopPosts renderCondition={this.state.showPop}/>
                </div>

                <div className="col-xl-7 row">
                    <div className="col-md-6 elem zweite">    
                        <RedditDimensionenRadar/>
                        <br/>
                        <br/>
                        <RedditBarChart/>   
                    </div>
                    <div className="col-md-6 elem dritte">
                        <KeyFacts/>
                        <br/>
                        <RedditSubscriberChart/>
                        <br/>
                        <RedditBarChartGesamt/>
                        <br/>
                    </div>
                </div> 
            </div>
        );
    }else{
        return null
    }
  }
}