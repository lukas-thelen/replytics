//KOMMENTIERT
import React, { Component } from 'react';
import Tracker from 'tracker-component';

export class RedditSelbstposten extends Tracker.Component {
	constructor(props) {
		super(props);
		this.state = {
			dimension: 'not defined',
			content: 'Hallo',
			title: 'Hallo',
		};
	}
	//ruft Meteor Methoden aus der twitter js auf, die die state Werte zum postene und speichern verwendet und die Datenbanken neu laden
	submitSelfPost = (event) => {
		event.preventDefault();
		Meteor.call('reddit_posten', Meteor.user().username, this.state.title, this.state.content, this.state.dimension )
		event.target.reset()
	}
	//speichert den eingegebenen Titel des Nutzers im state
	changeTitle = (event) => {
		this.setState({title: event.target.value})
	}
	//speichert den eingegebenen Text des Nutzers im state
	changeContent = (event) => {
		this.setState({content: event.target.value});
	}
	//speichert die ausgewählte Dimension im state
	changeDimension = (event) => {
		this.setState({dimension: event.target.value})
	}
  
 	//Darstellung auf dem Dashboard 
	render() {
		return (
			<div>
				<form onSubmit={ this.submitSelfPost }>
					<div className="container">
						<h5>Beitrag verfassen:
							<button type="button" className="hover btn btn-link alert-light" data-toggle="tooltip" data-placement="right" title="Hier haben Sie die Möglichkeit einen Beitrag zu verfassen, welcher auf Ihrem Account direkt sichbar ist. Der Beitrag unterteilt sich in eine Überschrift und den dazu gehörigen Text. Darunter wählen Sie bitte die ensprechende Kategorie zum Inhalt Ihres Beitrags aus. Falls Sie mehr Informationen benötigen, gehen Sie zu den Einstellungen.">
								<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
									<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
									<path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
								</svg>
							</button>
						</h5>
					</div>
					<script>
						$(document).ready(function(){
							$('[data-toggle="tooltip"]').tooltip   
						});
					</script>
					<div className=" row col-md-10 pb-2">
						<textarea 
							placeholder="Überschrift eingeben..."
							className="form-control .w-75" 
							name='title'
							id='title'
							rows='1'
							onChange = {this.changeTitle}
						/>
					</div>	
					<div className=" row col-md-10">
						<textarea 
							placeholder="Schreibe etwas..."
							className="form-control .w-75" 
							name='content'
							id='content'
							rows='3'
							onChange = {this.changeContent}
						/>
					</div>
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
						<input style={{height:"38px", marginBottom:"4%"}}className="col-md-3 btn btn-secondary" type='submit' value="Posten"/>
					</div>
		 		</form>
			</div>
		);
	}
}
