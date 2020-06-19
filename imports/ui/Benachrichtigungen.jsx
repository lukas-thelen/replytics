import React, { Component } from 'react';
import Tracker from 'tracker-component';
import { Settings_DB } from '../api/settings.js';
import { Posts } from '../api/twitter_posts.js';
import { Dimensionen } from '../api/twitter_dimensionen.js';
 

export class Benachrichtigungen extends Tracker.Component {
    constructor(props){
        super(props);
        this.state={
            handlungsempfehlungen:[],
            dimensionen:[],
            showMore: false
        }
    }
    componentWillMount = () =>{
        this.checkImportant();
        this.checkVeryImportant();
        this.checkEngagementCountRatio();
    }

    übersetzung ={
        p_d: "Produkt und Dienstleistung",
        e: "Emotionen",
        a: "Arbeitsplatzumgebung",
        f: "Finanzleistung",
        g_v: "Gesellschaftliche Verantwortung",
        v_f: "Vision und Führung"
    }
    übersetzung02 ={
        p_d: "Produkt_und_Dienstleistung",
        e: "Emotionen",
        a: "Arbeitsplatzumgebung",
        f: "Finanzleistung",
        g_v: "Gesellschaftliche_Verantwortung",
        v_f: "Vision_und_Führung"
    }
    übersetzung03 ={
        Produkt_und_Dienstleistung: "Produkt und Dienstleistung",
        Emotionen: "Emotionen",
        Arbeitsplatzumgebung: "Arbeitsplatzumgebung",
        Finanzleistung: "Finanzleistung",
        Gesellschaftliche_Verantwortung: "Gesellschaftliche Verantwortung",
        Vision_und_Führung: "Vision und Führung"
    }
    
    zusatzinfos ={
        Produkt_und_Dienstleistung: 
            <div> 
                <h6>Ideen für Posts</h6>
                <p>TestTEstTEstTEst</p>
            </div>,
        Emotionen: "Emotionen",
        Arbeitsplatzumgebung: "Arbeitsplatzumgebung",
        Finanzleistung: "Finanzleistung",
        Gesellschaftliche_Verantwortung: "Gesellschaftliche Verantwortung",
        Vision_und_Führung: "Vision und Führung"
    }

    checkEngagementCountRatio = () =>{
        var dimensionen = this.getVeryImportantDimensions().concat(this.getImportantDimensions());
        var unwichtig = this.getUnImportantDimensions()
        var datenbankWerte = Dimensionen.find({username:Meteor.user().username}).fetch()
        var sortedEngagement = []
        var sortedCount = []
        for (var i=0; i<unwichtig.length;i++){
            delete datenbankWerte[0][this.übersetzung02[unwichtig[i]]]
        }
        for (var i=0; i<dimensionen.length;i++){
            sortedEngagement.push(this.übersetzung02[dimensionen[i]])
            sortedCount.push(this.übersetzung02[dimensionen[i]])
        }
        for (var i = 0; i < sortedEngagement.length; i++) {
            var minE = i;
            for (var j = i + 1; j < sortedEngagement.length; j++) {
                if (datenbankWerte[0][sortedEngagement[minE]].engagement > datenbankWerte[0][sortedEngagement[j]].engagement) {
                    minE = j;
                }
            }
            if (minE !== i) {
                var tmp = sortedEngagement[i];
                sortedEngagement[i] = sortedEngagement[minE];
                sortedEngagement[minE] = tmp;
            }
        }
        sortedEngagement.reverse()
        for (var i = 0; i < sortedCount.length; i++) {
            var minC = i;
            for (var j = i + 1; j < sortedCount.length; j++) {
                if (datenbankWerte[0][sortedCount[minC]].count > datenbankWerte[0][sortedCount[j]].count) {
                    minC = j;
                }
            }
            if (minC !== i) {
                var tmp = sortedCount[i];
                sortedCount[i] = sortedCount[minC];
                sortedCount[minC] = tmp;
            }
        }
        for(var i=0;i<2;i++){
            for(var j=0; j<2;j++){
                if(sortedEngagement[i]===sortedCount[j]){
                    var he = this.state.handlungsempfehlungen
                    he.push("Ungenutztes Potenzial bei " + this.übersetzung03[sortedEngagement[i]])
                    this.setState({handlungsempfehlungen: he})
                    var dm = this.state.dimensionen
                    dm.push(sortedEngagement[i])
                    this.setState({dimensionen: dm})
                }
            }
        }
        console.log(sortedEngagement)
        console.log(sortedCount)
    }

    checkVeryImportant = () => {
        var posts = Posts.find({username: Meteor.user().username}, {sort:{date:-1}}).fetch();
        var notPosted = []
        var veryImportant = this.getVeryImportantDimensions();
        console.log(veryImportant)
        for(var d=0; d<veryImportant.length; d++){
            var dimensionVorhanden = false
                for (var x=0;x<Math.min(7,posts.length);x++){              
                    if(posts[x].dimension === this.übersetzung[veryImportant[d]]){
                        console.log("sdfasdfasdf")
                        dimensionVorhanden = true
                    }
                }
                console.log(dimensionVorhanden)
            if(!dimensionVorhanden){
                var he = this.state.handlungsempfehlungen
                he.push("Sie haben schon länger nichts mehr über die Kategorie " + this.übersetzung[veryImportant[d]] +" gepostet")
                this.setState({handlungsempfehlungen: he})
                var dm = this.state.dimensionen
                dm.push(this.übersetzung02[veryImportant[d]])
                this.setState({dimensionen: dm})
            }
        }
    }

    checkImportant = () => {
        var posts = Posts.find({username: Meteor.user().username}, {sort:{date:-1}}).fetch();
        var notPosted = []
        var important = this.getImportantDimensions();
        for(var d=0; d<important.length; d++){
            var dimensionVorhanden = false
                for (var x=0;x<Math.min(16,posts.length);x++){              
                    if(posts[x].dimension === this.übersetzung[important[d]]){
                        dimensionVorhanden = true
                    }
                }
            
            if(!dimensionVorhanden){
                var he = this.state.handlungsempfehlungen
                he.push("Sie haben schon länger nichts mehr über die Kategorie " + this.übersetzung[important[d]] +" gepostet")
                this.setState({handlungsempfehlungen: he})
                var dm = this.state.dimensionen
                dm.push(this.übersetzung02[important[d]])
                this.setState({dimensionen: dm})
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
        var empfehlungen = this.state
        return empfehlungen
    }
    absenden = () =>{
        var he = this.state.handlungsempfehlungen
        he.push("TESTTESTTESTTEST")
        this.setState({handlungsempfehlungen: he})
        this.render();
    }
    erledigt = (index)=>{
        var he = this.state.handlungsempfehlungen
        he.splice(index,1)
        this.setState({handlungsempfehlungen: he})
        var dm = this.state.dimensionen
        dm.splice(index,1)
        this.setState({dimensionen: dm})
        this[index].checked= false
    }
    showMore = () => {
        this.setState({showMore:!this.state.showMore})
    }
    infos = (index) =>{
        console.log(this[String("i"+index)])
        if(this["i"+index].className === "d-none text-left"){
            this["i"+index].className = "d-block text-left"
        }else{
            this["i"+index].className = "d-none text-left"
        }
    }

    render() {

        const Element = this.state.handlungsempfehlungen.map((text, index) =>
        <div>
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
            <span className="w-75 font-weight-lighter">{text}</span>
            <small>{this.übersetzung03[this.state.dimensionen[index]]}</small>
            <input ref={(input)=>{this[index] = input}}type="checkbox" onClick={() => this.erledigt(index)} className="form-check-input"/>
            </div>
            <div className="text-center pt-2">
            <svg onClick={() => this.infos(index)} className="bi bi-chevron-expand" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
            </svg>
            <div className="d-none text-left" ref={(div)=>{this["i"+index] = div}}>{this.zusatzinfos[this.state.dimensionen[index]]}</div>
            </div>
        </li>
        </div>
        );
        const ElementSmall = this.state.handlungsempfehlungen.slice(0,3).map((text, index) =>
        <div>
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
            <span className="w-75 font-weight-lighter">{text}</span>
            <small>{this.übersetzung03[this.state.dimensionen[index]]}</small>
            <input ref={(input)=>{this[index] = input}}type="checkbox" onClick={() => this.erledigt(index)} className="form-check-input"/>
            </div>
            <div className="text-center pt-2">
            <svg onClick={() => this.infos(index)} className="bi bi-chevron-expand" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
            </svg>
            <div className="d-none text-left" ref={(div)=>{this["i"+index] = div}}>{this.zusatzinfos[this.state.dimensionen[index]]}</div>
            </div>
        </li>
        </div>
        );
        return (
        //alles, was zurück geschickt werden soll
        <div> {/*this.showState().handlungsempfehlungen*/} <ul className="list-group list-group-flush">
            {this.state.showMore && Element}{!this.state.showMore && ElementSmall}</ul>
        <form>
                <input className="btn btn-secondary mr-3" type="button" onClick={this.absenden} value="test"></input>
                {!this.state.showMore && <input className="btn btn-link" type="button" onClick={this.showMore} value="Mehr anzeigen"></input>}
                {this.state.showMore && <input className="btn btn-link" type="button" onClick={this.showMore} value="Weniger anzeigen"></input>}
            </form>
        </div>
        );
    }
}