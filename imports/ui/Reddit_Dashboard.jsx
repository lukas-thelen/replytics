import React, { Component } from 'react';
import Tracker from 'tracker-component';
 

//Components
import { Reddit_KeyFacts } from './Reddit_KeyFacts.jsx';
import { RedditSelbstposten } from './reddit_posten.jsx';
import { Reddit_Benachrichtigungen } from './Reddit_Benachrichtigungen.jsx';
import { Reddit_TopPosts } from './Reddit_TopPosts.jsx';
import { Subreddit_TopPosts } from './Subreddit_TopPosts.jsx';
import { RedditBarChart } from './RedditBarChart.jsx';
import { RedditBarChartGesamt } from './RedditBarChartGesamt.jsx';
import { RedditSubscriberChart } from './RedditSubscriberChart.jsx';
import { RedditDimensionenRadar } from './RedditDimensionen.jsx';
import { Reddit_SearchPosts } from './Reddit_SearchPosts.jsx';

//Dashboard für Reddit - Zusammenfassung aller Components in diesem Kontext
//wird nur gerendert, wenn Bedingungen in App.jsx erfüllt sind
export class Reddit_Dashboard extends Tracker.Component {
    constructor(props){
        super(props);
        //States geben an welcher Component unten links angeziegt werden soll
        this.state = {
          showTop: true,
          showPop: false,
          showSub: false
        }
        this.toTop = this.toTop.bind(this)
        this.toPop = this.toPop.bind(this)
        this.toSub = this.toSub.bind(this)
    }

    //Funktionen, die jeweils einen anderen Component anzeigen und den Button als geklickt markieren
    toTop(){
        this.setState({showPop:false})
        this.setState({showTop:true})
        this.setState({showSub:false})
        this.top.className="btn btn-secondary btn-sm active"
        this.sub.className="btn btn-secondary btn-sm"
        this.pop.className="btn btn-secondary btn-sm"
    }
    toPop(){
        this.setState({showPop:true})
        this.setState({showTop:false})
        this.setState({showSub:false})
        this.top.className="btn btn-secondary btn-sm"
        this.sub.className="btn btn-secondary btn-sm"
        this.pop.className="btn btn-secondary btn-sm active"
    }
    toSub(){
        this.setState({showSub:true})
        this.setState({showPop:false})
        this.setState({showTop:false})
        this.top.className="btn btn-secondary btn-sm"
        this.sub.className="btn btn-secondary btn-sm active"
        this.pop.className="btn btn-secondary btn-sm"
    }
  render() {
    //wird nur gerendert, wenn die Variable "renderCondition" mit dem Wert true von App.jsx übergeben wird
    if(this.props.renderCondition){
        return (

            <div className="content row" >

                <div className="col-xl-5 elem erste">                             
                    <RedditSelbstposten renderCondition={this.props.renderCondition}/>
                    <Reddit_Benachrichtigungen renderCondition={this.props.renderCondition}/>
                    <br/>

                    {/* Menü, um den Component unten links auszuwählen */}
                    <div className="d-flex w-100 justify-content-between " >
                        <h5 style={{display:"inline"}} >Post-Analyse
                        <button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier erhalten Sie einen Überblick über Ihre erfolgreichsten Posts des letzten Monats. Entsprechende Statistiken finden Sie in Kurzform darunter. Wenn Sie den Button rechts auf 'Top im Subreddit' umstellen, bekommen Sie die Möglichkeit die besten Posts des ausgewählten Subbreddit zu sehen. "><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                        </svg></button></h5>
                        
                        <span className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-secondary btn-sm active" ref={(input)=>{this.top = input}} onClick={this.toTop}>Meine Posts</button>
                            <button type="button" className="btn btn-secondary btn-sm" ref={(input)=>{this.pop = input}} onClick={this.toPop}>Posts suchen</button>
                            <button type="button" className="btn btn-secondary btn-sm" ref={(input)=>{this.sub = input}} onClick={this.toSub}>Top im Subreddit</button>
                        </span>
                    </div>
                        {/* Components werden nur gerendert, wenn der State=true */}
                        <Reddit_TopPosts renderCondition={this.state.showTop}/>
                        <Reddit_SearchPosts renderCondition={this.state.showPop}/>
                        <Subreddit_TopPosts renderCondition={this.state.showSub}/>
                </div>

                <div className="col-xl-7 row">
                    <div className="col-md-6 elem zweite">    
                        <RedditDimensionenRadar renderCondition={this.props.renderCondition}/>
                        <br/>
                        <br/>
                        <RedditBarChart renderCondition={this.props.renderCondition}/>   
                    </div>
                    <div className="col-md-6 elem dritte">
                        <Reddit_KeyFacts renderCondition={this.props.renderCondition}/>
                        <br/>
                        <RedditSubscriberChart renderCondition={this.props.renderCondition}/>
                        <br/>
                        <RedditBarChartGesamt renderCondition={this.props.renderCondition}/>
                        <br/>
                    </div>
                </div> 
            </div>
        );
    }else{
        //auch wenn das Twitter-Dashboard nicht gerendert wird, wird der SearchPosts Component aufgerufen aber nicht gerendert 
        //dadurch greift der Autorun von App.jsx und der Component bleibt reaktiv
        return (
            <div>
                <Reddit_SearchPosts renderCondition={this.state.showPop && this.props.renderCondition}/>
                <Reddit_Benachrichtigungen renderCondition={this.props.renderCondition}/>
                <Reddit_TopPosts renderCondition={this.state.showTop && this.props.renderCondition}/>
                <Subreddit_TopPosts renderCondition={this.state.showSub && this.props.renderCondition}/>
                <RedditDimensionenRadar renderCondition={this.props.renderCondition}/>
                <RedditBarChart renderCondition={this.props.renderCondition}/>
                <Reddit_KeyFacts renderCondition={this.props.renderCondition}/>
                <RedditSubscriberChart renderCondition={this.props.renderCondition}/>
                <RedditBarChartGesamt renderCondition={this.props.renderCondition}/>
            </div>
        )
    }
  }
}