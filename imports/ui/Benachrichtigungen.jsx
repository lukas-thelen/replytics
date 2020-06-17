import React, { Component } from 'react';
import Tracker from 'tracker-component';
import { Settings_DB } from '../api/settings.js';
import { Posts } from '../api/twitter_posts.js';
 

export class Benachrichtigungen extends Tracker.Component {
    constructor(props){
        super(props);
        this.state={
            handlungsempfehlungen:["Test"]
        }
    }

    componentWillMount = () =>{
        this.checkImportant();
        this.checkVeryImportant();
    }

    checkVeryImportant = () => {
        var posts = Posts.find({username: Meteor.user().username}, {sort:{date:-1}}).fetch();
        var übersetzung ={
            p_d: "Produkt und Dienstleitung",
            e: "Emotionen",
            a: "Arbeitsplatzumgebung",
            f: "Finanzleistung",
            g_v: "Gesellschaftliche Verantwortung",
            v_f: "Vision und Führung"
        }
        var notPosted = []
        var veryImportant = this.getVeryImportantDimensions();
        for(var d=0; d<veryImportant.length; d++){
            var dimensionVorhanden = false
                for (var x=0;x<Math.min(7,posts.length);x++){              
                    if(posts[x].dimension === übersetzung[veryImportant[d]]){
                        dimensionVorhanden = true
                    }
                }
        if(!dimensionVorhanden){
            var he = this.state.handlungsempfehlungen
            he.push("Sie haben schon länger nichts mehr über die Kategorie " + übersetzung[veryImportant[d]] +" gepostet")
            this.setState({handlungsempfehlungen: he})
        }
        }
    }

    checkImportant = () => {
        var posts = Posts.find({username: Meteor.user().username}, {sort:{date:-1}}).fetch();
        var übersetzung ={
            p_d: "Produkt und Dienstleitung",
            e: "Emotionen",
            a: "Arbeitsplatzumgebung",
            f: "Finanzleistung",
            g_v: "Gesellschaftliche Verantwortung",
            v_f: "Vision und Führung"
        }
        var notPosted = []
        var important = this.getImportantDimensions();
        for(var d=0; d<important.length; d++){
            var dimensionVorhanden = false
                for (var x=0;x<Math.min(16,posts.length);x++){              
                    if(posts[x].dimension === übersetzung[important[d]]){
                        dimensionVorhanden = true
                    }
                }
        if(!dimensionVorhanden){
            var he = this.state.handlungsempfehlungen
            he.push("Sie haben schon länger nichts mehr über die Kategorie " + übersetzung[important[d]] +" gepostet")
            this.setState({handlungsempfehlungen: he})
        }
        }
    }

    getVeryImportantDimensions = () => {
        var settings = Settings_DB.find({username: Meteor.user().username}).fetch();
        var dimensionen = ["p_d", "e", "a", "f", "v_f", "g_v"]
        var important = []
        for(var i=0;i<dimensionen.length;i++){
            if(settings[0][dimensionen[i]]==="2"){
                important.push(dimensionen[i])
            }
        }
        return important
    }

    getImportantDimensions = () => {
        var settings = Settings_DB.find({username: Meteor.user().username}).fetch();
        var dimensionen = ["p_d", "e", "a", "f", "v_f", "g_v"]
        var important = []
        for(var i=0;i<dimensionen.length;i++){
            if(settings[0][dimensionen[i]]==="1"){
                important.push(dimensionen[i])
            }
        }
        return important
    }

    getUnImportantDimensions = () => {
        var settings = Settings_DB.find({username: Meteor.user().username}).fetch();
        var dimensionen = ["p_d", "e", "a", "f", "v_f", "g_v"]
        var important = []
        for(var i=0;i<dimensionen.length;i++){
            if(settings[0][dimensionen[i]]==="0"){
                important.push(dimensionen[i])
            }
        }
        return important
    }

    showState = () => {
        return this.state.handlungsempfehlungen
    }

    render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
        return (
        //alles, was zurück geschickt werden soll
        <div> {this.state.handlungsempfehlungen} </div>
        );
    }
}