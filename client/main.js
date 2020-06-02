import  React  from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.jsx';
 

//Sobald App auf Client gestartet wird: den Output der App Component auf dem div namens 'render-target' im main.html ausgeben
Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});