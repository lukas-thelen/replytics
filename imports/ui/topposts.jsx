import React, { Component } from 'react';
import Tracker from 'tracker-component';
 
import {Posts} from '../api/twitter_posts.js';

export class TopPosts extends Tracker.Component {
	constructor(props){
    super(props)
    this.state = {number: 0}

//getText(){
	//var text = Posts.find({text: Meteor.user().text})
	//return text
	
 //Platz für neue Funktionen, die innerhalb der Klasse verwendet werden können 
  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
	//<form {onSubmit=this.text}
        //alles, was zurück geschickt werden soll
		//<p> Was kommt hier heraus? </p>
	//</form>	
	
	// var createdAt = this.props.created_at;
    //var date = createdAt.substring(4,10);
    //var time = createdAt.substring(11,19);
    //var dateOutput = date + " - " + time;
	//Datum anzeigen an welchem der Post verfasst wurde
    return (
	
        <Card bg='light' className={"card flex-row flex-wrap"} style={{margin: 5, padding: 5}}>
          <Row className={'text'}>
          <Col xs={'2'}>
            <div>
            <Image style={{width: 45, padding: 3}} src={this.props.image} roundedCircle/>
            </div>
          </Col>
          <Col xs={'10'} className={'tweeted'}>
                <div>
                  <strong>{this.props.username}</strong>
                </div>
                <div>
                <p></p>
                  {this.props.text}
                  <div>
                  <p></p>
                  <Button variant="outline-info" style={{height: 18, fontSize: 11, padding: 1, margin: 3}}>{this.props.fav} Liked</Button>
                  <Button variant="outline-success" style={{height: 18, fontSize: 11, padding: 1, margin: 3}}>{this.props.retweets} Retweets</Button>
                  //<Button variant="outline-warning" style={{height: 18, fontSize: 11, padding: 1, margin: 3}}>Sentiment: {this.props.sentiment}</Button>
                  </div>
                  <p></p>
                  //<a href={this.props.tweetLink} target="_blank"><Button variant="outline-dark" style={{height: 18, fontSize: 11, padding: 1, margin: 3}}>Zum Tweet</Button></a>
                  <p></p>
                  {dateOutput}
                </div>
          </Col>
          </Row>
        </Card>
    )
  }
}


export default TopPosts
    );
  }
}