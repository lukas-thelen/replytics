import  React  from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Tracker } from 'meteor/tracker';
 
import App from '../imports/ui/App.jsx';
import '../imports/startup/accounts-config.js';
 

//Sobald App auf Client gestartet wird: den Output der App Component auf dem div namens 'render-target' im main.html ausgeben
Meteor.startup(() => {
  Tracker.autorun(async function(){ 
    render(<App />, document.getElementById('render-target'));
  });
});