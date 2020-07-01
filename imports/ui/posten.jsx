import React, { Component } from 'react';
import Tracker from 'tracker-component';
 

export class Selbstposten extends Tracker.Component {
	constructor(props) {
		super(props);
		this.state = {
			dimension: 'not defined',
			content: 'Hallo',
		};
	}
	submitPost = (event) => {
		Meteor.call('postTweet', this.state.content, this.state.dimension, Meteor.user().username)
	}
	
	changeContent = (event) => {
		this.setState({content: event.target.value});
	}
	changeDimension = (event) => {
		this.setState({dimension: event.target.value})
	}
 //Platz für neue Funktionen, die innerhalb der Klasse verwendet werden können 
	render() {
		
		  //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
		return (
			//alles, was zurück geschickt werden soll
			<div className="grey">
			<form onSubmit={ this.submitPost }>
				<h5>Tweets verfassen:
				<button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier haben Sie die Möglichkeit einen Tweet zu verfassen, welcher auf Ihrem Account direkt sichbar ist. Darunter wählen Sie bitte die ensprechende Kategorie zum Inhalt Ihres Tweets aus. Falls Sie mehr Informationen benötigen, gehen Sie zu den Einstellungen."><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
		</svg></button></h5>
				<textarea 
					placeholder="Schreibe etwas..."
					className="form-control .w-75" 
					name='content'
					id='content'
					
					onChange = {this.changeContent}
				/>
				<br></br>
				<div className= "row col-md-10">
				<select onChange = {this.changeDimension} style={{marginBottom:"4%"}} className="custom-select mr-sm-2 col-md-7">
					<option value="Dimension wählen">Kategorie wählen</option>
					<option value="not defined">keine Angabe</option>
					<option value="Produkt und Dienstleistung">Produkt und Dienstleistung</option>
					<option value="Emotionen">Emotionen</option>
					<option value="Arbeitsplatzumgebung">Arbeitsplatzumgebung</option>
					<option value="Finanzleistung">Finanzleistung</option>
					<option value="Vision und Führung">Vision und Führung</option>
					<option value="Gesellschaftliche Verantwortung">Gesellschaftliche Verantwortung</option>
				</select>
				<input style={{height:"38px", marginBottom:"4%"}}className="col-md-3 btn" type='submit' value="Posten"/>
				</div>
		  </form>
		  </div>
		);
	}
}
