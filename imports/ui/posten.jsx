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
			<form onSubmit={ this.submitPost }>
				<p>Hier ist Platz fürs Posten:</p>
				<textarea 
					placeholder="Schreibe etwas..."
					className="form-control" 
					name='content'
					id='content'
					onChange = {this.changeContent}
				/>
				<br></br>
				<div className= "row col-md-10">
				<select onChange = {this.changeDimension} className="custom-select mr-sm-2 col-md-7">
					<option value="Dimension wählen">Kategorie wählen</option>
					<option value="not defined">keine Angabe</option>
					<option value="Produkt und Dienstleistung">Produkt und Dienstleistung</option>
					<option value="Emotionen">Emotionen</option>
					<option value="Arbeitsplatzumgebung">Arbeitsplatzumgebung</option>
					<option value="Finanzleistung">Finanzleistung</option>
					<option value="Vision und Führung">Vision und Führung</option>
					<option value="Gesellschaftliche Verantwortung">Gesellschaftliche Verantwortung</option>
				</select>
				<br/>
				<br/>
				<input className="col-md-3 btn " type='submit' value="Posten"/>
				</div>
		  </form>
		);
	}
}
