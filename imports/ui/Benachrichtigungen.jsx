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
        this.wochenbericht();
        this.checkShitstorm();
        this.checkNegativePosts();
        this.checkVeryImportant();
        this.checkImportant();
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
        Vision_und_Führung: "Vision und Führung",
        negatives_Feedback: "negatives Feedback",
        Shitstorm: "Shitstorm"
    }
    
    zusatzinfos ={
        Produkt_und_Dienstleistung: 
            <div> 
                <h6>Ideen für Posts</h6>
                <ul>
                <li >Content posten, der Produkte aus dem Unternehmen bewirbt</li>
                <li >die Follower über neue Angebote informieren</li>
                <li >Serviceangebot aufzeigen</li>
                </ul>
            </div>,
        Emotionen: 
            <div> 
                <h6>Ideen für Posts</h6>
                <ul>
                <li >Das Produkt in einem positiven Kontext präsentieren</li>
                <li style={{listStyleType: "none"}}>z.B. im Familienkontext zu Weihnachten oder bei schönem Wetter im Sommer</li>
                <li >Persönliche Kundenbewertungen teilen</li>
                </ul>
            </div>,
        Arbeitsplatzumgebung: 
            <div> 
                <h6>Ideen für Posts</h6>
                <ul>
                <li >Mitarbeiter in verschiedenen Positionen vorstellen</li>
                <li >von Firmenevents berichten</li>
                <li >Die Belegschaft als Familie präsentieren</li>
                </ul>
            </div>,
        Finanzleistung: 
            <div> 
                <h6>Ideen für Posts</h6>
                <ul>
                <li >Pläne für die Zukunft vorstellen</li>
                <li >Jahresbilanzen als Unternehmenserfolg präsentieren</li>
                <li >von vergangener Expansion berichten</li>
                </ul>
            </div>,
        Gesellschaftliche_Verantwortung: 
            <div> 
                <h6>Ideen für Posts</h6>
                <ul>
                <li >eigene Umweltprojekte starten und präsentieren</li>
                <li >Unterstützung für Hilfsorganisationen bekunden</li>
                <li >Gedanken zu aktuell relevanten Themen teilen</li>
                <li >nachhaltige Umweltziele aufstellen und darüber berichten</li>
                </ul>
            </div>,
        Vision_und_Führung: 
            <div> 
                <h6>Ideen für Posts</h6>
                <ul>
                <li>Firmenleitlinien erläutern</li>
                <li >Prototypen und neue Ideen vorstellen</li>
                <li >Den Kunden die Firmengeschichte näher bringen</li>
                </ul>
            </div>,
        negatives_Feedback:
            <div> 
                <h6>Tipps für weiteres Vorgehen</h6>
                <ul>
                <li>Mit den Kommentaren zu dem Posts auseinandersetzen</li>
                <li>Vielleicht wurde ein kritisches Thema angesprochen, das es in Zukunft zu vermeiden gilt</li>
                <li>Sachlich auf die Kritik der Nutzer reagieren</li>
                </ul>
            </div>,
        Shitstorm:
            <div> 
                <h6>Tipps für weiteres Vorgehen</h6>
                <ul>
                <li>Mit den Kommentaren zu dem Posts auseinandersetzen</li>
                <li>Vielleicht wurde ein kritisches Thema angesprochen, das es in Zukunft zu vermeiden gilt</li>
                <li>Sachlich auf die Kritik der Nutzer reagieren</li>
                </ul>
            </div>
    }

    wochenbericht =()=>{
        var postArray = Posts.find({username: Meteor.user().username, retweet:false}, {sort:{date:-1}}).fetch();
        var lastWeek = new Date();
        var pastDate = lastWeek.getDate() - 7;
        lastWeek.setDate(pastDate);
        var tweetDate = new Date()
        var i= 0;
        var neg = 0;
        var pos = 0;
        var neu = 0;
        var eng = 0;
        var count = 0;
        while (lastWeek.getTime()<tweetDate.getTime() && i<postArray.length){
            neg += postArray[i].s_neg;
            pos += postArray[i].s_pos;
            neu += postArray[i].s_neu;
            count += 1;
            eng += postArray[i].engagement
            tweetDate = postArray[i].date
            i++
        }
        eng = Number(eng/i).toFixed(2)
        return (
        <div>
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
            <strong className="w-75 font-weight-lighter">Wochenbericht:</strong>
            </div>
            <div className="row">
            <span className="col-6 col-xl-3"><span className="text-muted">Postanzahl: </span>{count} </span>
            <span className="col-6 col-xl-3"><span className="text-muted">Engagement: </span>{eng}</span>
            <span className="col-6 col-xl-3"><span className="text-muted">pos. Kommentare: </span>{pos}</span>
            <span className="col-6 col-xl-3"><span className="text-muted">neg. Kommentare: </span>{neg}</span>
            </div>
        </li>
        </div>)
    }

    checkNegativePosts = ()=>{
        var postArray = Posts.find({username: Meteor.user().username, retweet:false}, {sort:{date:-1}}).fetch();
        postArray = postArray.slice(0,11)
        for (var i=0; i<postArray.length;i++){
            if(postArray[i].s_neg>postArray[i].s_pos && postArray[i].s_neg<2*postArray[i].s_pos){
                var he = this.state.handlungsempfehlungen
                he.push("Es gibt negatives Feedback auf deinen Post \""+postArray[i].text+"\".")
                this.setState({handlungsempfehlungen: he})
                var dm = this.state.dimensionen
                dm.push("negatives_Feedback")
                this.setState({dimensionen: dm})
            }
        }
    }
    checkShitstorm = ()=>{
        var postArray = Posts.find({username: Meteor.user().username, retweet:false}).fetch();
        postArray = postArray.slice(0,11)
        console.log(postArray)
        for (var i=0; i<postArray.length;i++){
            if(postArray[i].s_neg>=2*postArray[i].s_pos && postArray[i].s_pos!=0){
                var he = this.state.handlungsempfehlungen
                he.push("Achtung! Ihr Post \""+postArray[i].text+"\" könnte zu einem Shitstorm geführt haben.")
                this.setState({handlungsempfehlungen: he})
                var dm = this.state.dimensionen
                dm.push("Shitstorm")
                this.setState({dimensionen: dm})
            }
        }
    }

    checkEngagementCountRatio = () =>{
        var dimensionen = ["p_d", "e", "a", "f", "v_f", "g_v"]
        var importantDimensionen = this.getVeryImportantDimensions().concat(this.getImportantDimensions())
        var datenbankWerte = Dimensionen.find({username:Meteor.user().username}).fetch()
        var sortedEngagement = []
        var sortedCount = []
        var sortedSentiment = []
        /*for (var i=0; i<unwichtig.length;i++){
            delete datenbankWerte[0][this.übersetzung02[unwichtig[i]]]
        }*/
        for (var i=0; i<dimensionen.length;i++){
            sortedEngagement.push(this.übersetzung02[dimensionen[i]])
        }
        sortedSentiment = sortedEngagement.slice();
        sortedCount = sortedEngagement.slice();

        for (var i=0; i<importantDimensionen.length;i++){
            importantDimensionen[i]=this.übersetzung02[importantDimensionen[i]]
        }
        //Sortierung nach Engagement
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
        //Sortierung nach Anzahl
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
        //Sortierung nach Sentiment
        for (var i = 0; i < sortedSentiment.length; i++) {
            var minC = i;
            for (var j = i + 1; j < sortedSentiment.length; j++) {
                if ((datenbankWerte[0][sortedSentiment[minC]].s_pos+1)/(datenbankWerte[0][sortedSentiment[minC]].s_neg+1) 
                    > (datenbankWerte[0][sortedSentiment[j]].s_pos+1)/(datenbankWerte[0][sortedSentiment[j]].s_neg+1)) {
                    minC = j;
                }
            }
            if (minC !== i) {
                var tmp = sortedSentiment[i];
                sortedSentiment[i] = sortedSentiment[minC];
                sortedSentiment[minC] = tmp;
            }
        }
        sortedSentiment.reverse()
        for(var i=0;i<3;i++){
            for(var j=0; j<3;j++){
                if(sortedEngagement[i]===sortedCount[j] && sortedEngagement[i]!= undefined && importantDimensionen.includes(sortedEngagement[i])){
                    var he = this.state.handlungsempfehlungen
                    he.push("Sie haben ungenutztes Potenzial in der Kategorie " + this.übersetzung03[sortedEngagement[i]] +".")
                    this.setState({handlungsempfehlungen: he})
                    var dm = this.state.dimensionen
                    dm.push(sortedEngagement[i])
                    this.setState({dimensionen: dm})
                }
            }
        }
        for(var i=0;i<2;i++){
            if(sortedSentiment[i]!=sortedCount[sortedCount.length-1]){
                var he = this.state.handlungsempfehlungen
                    he.push("Die Kategorie " + this.übersetzung03[sortedSentiment[i]] +" kommt sehr gut bei den Kunden an. Nutzen Sie dies und posten Sie mehr darüber.")
                    this.setState({handlungsempfehlungen: he})
                    var dm = this.state.dimensionen
                    dm.push(sortedSentiment[i])
                    this.setState({dimensionen: dm})
            }
        }
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
                he.push("Sie haben schon länger nichts mehr über die Kategorie " + this.übersetzung[important[d]] +" gepostet.")
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
            {this.state.dimensionen[index]==="Shitstorm" && <small className="text-danger">{this.übersetzung03[this.state.dimensionen[index]]}</small>}
            {this.state.dimensionen[index]!="Shitstorm" && <small>{this.übersetzung03[this.state.dimensionen[index]]}</small>}
            <input ref={(input)=>{this[index] = input}}type="checkbox" onClick={() => this.erledigt(index)} className="form-check-input"/>
            </div>
            <div className="text-center pt-2">
            <svg onClick={() => this.infos(index)} className="bi bi-chevron-expand" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
            </svg>
            <div className="d-none text-left" ref={(div)=>{this["i"+index] = div}}>{this.zusatzinfos[this.state.dimensionen[index]]}</div>
            </div>
        </li>
        </div>
        );
        const ElementSmall = this.state.handlungsempfehlungen.slice(0,2).map((text, index) =>
        <div>
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
            <span className="w-75 font-weight-lighter">{text}</span>
            {this.state.dimensionen[index]==="Shitstorm" && <small className="text-danger">{this.übersetzung03[this.state.dimensionen[index]]}</small>}
            {this.state.dimensionen[index]!="Shitstorm" && <small>{this.übersetzung03[this.state.dimensionen[index]]}</small>}
            <input ref={(input)=>{this[index] = input}}type="checkbox" onClick={() => this.erledigt(index)} className="form-check-input"/>
            </div>
            <div className="text-center pt-2">
            <svg onClick={() => this.infos(index)} className="bi bi-chevron-expand" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
            </svg>
            <div className="d-none text-left" ref={(div)=>{this["i"+index] = div}}>{this.zusatzinfos[this.state.dimensionen[index]]}</div>
            </div>
        </li>
        </div>
        );
        return (
        //alles, was zurück geschickt werden soll
        <div> {/* this.showState().handlungsempfehlungen */} <ul className="list-group list-group-flush">
            {this.wochenbericht()}
            {this.state.handlungsempfehlungen.length===0 && <span>keine Handlungsempfehlungen verfügbar</span>}
            {this.state.showMore && Element}{!this.state.showMore && ElementSmall}</ul>
        <form>
                <input className="btn btn-secondary mr-3" type="button" onClick={this.absenden} value="test"></input>
                {this.state.handlungsempfehlungen.length>2 && <span>
                {!this.state.showMore && <input className="btn btn-link" type="button" onClick={this.showMore} value="Mehr anzeigen"></input>}
                {this.state.showMore && <input className="btn btn-link" type="button" onClick={this.showMore} value="Weniger anzeigen"></input>}
                </span>}
            </form>
        </div>
        );
    }
}