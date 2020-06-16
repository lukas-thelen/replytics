import React, { Component } from 'react';
import Tracker from 'tracker-component';
import{ Settings_DB } from '../api/settings.js';
 

export class Settings extends Tracker.Component {
 //Platz für neue Funktionen, die innerhalb der Klasse verwendet werden können 
 constructor(props) {
    super(props);
    this.state = {
        p_d: "1",
        e: "1",
        a: "1",
        f: "1",
        v_f: "1",
        g_v: "1"
    };
}
componentDidMount = () => {
    this.getDefault();
}

getDefault = ()=>{
    var settings = Settings_DB.find({username: Meteor.user().username}).fetch();
    if(!settings[0]){
        Settings_DB.insert({ 
            p_d: "1",
            e: "1",
            a: "1",
            f: "1",
            v_f: "1",
            g_v: "1",
            username: Meteor.user().username
        })
        settings = [{ 
            p_d: "1",
            e: "1",
            a: "1",
            f: "1",
            v_f: "1",
            g_v: "1",
            username: Meteor.user().username
        }]
    }
        var array = ["p_d", "e", "a", "f", "v_f", "g_v"]
        for (var p = 0; p<array.length; p++){
            var value = array[p]
            var id = String(value+settings[0][value]);
            console.log(id);
            this[id].defaultChecked = true
        }
        this.setState({
            p_d: settings[0].p_d,
            e: settings[0].e,
            a: settings[0].a,
            f: settings[0].f,
            v_f: settings[0].v_f,
            g_v: settings[0].g_v
        })
}


 changeProdukt_und_Dienstleistung = (event) => {
    this.setState({p_d: event.target.value})
    console.log(this.state)
 }

 changeEmotionen = (event) =>{
    this.setState({e: event.target.value})
    console.log(this.state)
 }

 changeArbeitsplatz = (event) =>{
    this.setState({a: event.target.value})
    console.log(this.state)
 }

 changeFinanzen = (event) =>{
    this.setState({f: event.target.value})
    console.log(this.state)
 }

 changeVision_und_Führung = (event) =>{
    this.setState({v_f: event.target.value})
    console.log(this.state)
 }

 changeGs_Verantwortung = (event) =>{
    this.setState({g_v: event.target.value})
    console.log(this.state)
 }

 absenden = () => {

    console.log(this.state)
    Meteor.call('updateSettings',
        Meteor.user().username,
        this.state.p_d,
        this.state.e,
        this.state.a,
        this.state.f,
        this.state.v_f,
        this.state.g_v
    )
    console.log("checked")
 }

  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
		<div> Settings 
            <form onChange = {this.changeProdukt_und_Dienstleistung} className="row">
                <span className="col-2">Produkt und Dienstleistung  </span>
                <div className="form-check form-check-inline Produkt_und_Dienstleistung">
                    <input className="form-check-input" name="Produkt_und_Dienstleistung" type="radio" ref={(input)=>{this.p_d0 = input}} value="0"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">unwichtig</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" name="Produkt_und_Dienstleistung" type="radio" ref={(input)=>{this.p_d1 = input}} value="1" />
                    <label className="form-check-label" htmlFor="inlineRadio2">wichtig</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" name="Produkt_und_Dienstleistung" type="radio" ref={(input)=>{this.p_d2 = input}} value="2" />
                <label className="form-check-label" htmlFor="inlineRadio3">sehr wichtig</label>
                </div>
            </form>
            <form onChange = {this.changeEmotionen}  className="row">
                <br/>
                <span className="col-2">Emotionen  </span>
                <div className="form-check form-check-inline Emotionen">
                    <input className="form-check-input" name="Emotionen" type="radio" ref={(input)=>{this.e0 = input}} value="0"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">unwichtig</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" name="Emotionen" type="radio" ref={(input)=>{this.e1 = input}} value="1" />
                    <label className="form-check-label" htmlFor="inlineRadio2">wichtig</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" name="Emotionen" type="radio" ref={(input)=>{this.e2 = input}} value="2" />
                <label className="form-check-label" htmlFor="inlineRadio3">sehr wichtig</label>
                </div>
            </form>
            <form onChange = {this.changeArbeitsplatz}  className="row">
                <br/>
                <span className="col-2">Arbeitsplatzumgebung  </span>
                <div className="form-check form-check-inline Arbeitsplatzumgebung">
                    <input className="form-check-input" name="Arbeitsplatzumgebung" type="radio" ref={(input)=>{this.a0 = input}} value="0"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">unwichtig</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" name="Arbeitsplatzumgebung" type="radio" ref={(input)=>{this.a1 = input}} value="1"/>
                    <label className="form-check-label" htmlFor="inlineRadio2">wichtig</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" name="Arbeitsplatzumgebung" type="radio" ref={(input)=>{this.a2 = input}} value="2" />
                <label className="form-check-label" htmlFor="inlineRadio3">sehr wichtig</label>
                </div>
            </form>
            <form onChange = {this.changeFinanzen} className="row">
                <br/>
                <span className="col-2">Finanzleistung  </span>
                <div className="form-check form-check-inline Finanzleistung">
                    <input className="form-check-input" name="Finanzleistung" type="radio" ref={(input)=>{this.f0 = input}} value="0"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">unwichtig</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" name="Finanzleistung" type="radio" ref={(input)=>{this.f1 = input}} value="1"/>
                    <label className="form-check-label" htmlFor="inlineRadio2">wichtig</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" name="Finanzleistung" type="radio" ref={(input)=>{this.f2 = input}} value="2" />
                <label className="form-check-label" htmlFor="inlineRadio3">sehr wichtig</label>
                </div>
            </form>
            <form onChange = {this.changeVision_und_Führung} className="row">
                <br/>
                <span className="col-2">Vision und Führung  </span>
                <div className="form-check form-check-inline Vision_und_Führung">
                    <input className="form-check-input" name="Vision_und_Führung" type="radio" ref={(input)=>{this.v_f0 = input}} value="0"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">unwichtig</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" name="Vision_und_Führung" type="radio" ref={(input)=>{this.v_f1 = input}} value="1"/>
                    <label className="form-check-label" htmlFor="inlineRadio2">wichtig</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" name="Vision_und_Führung" type="radio" ref={(input)=>{this.v_f2 = input}} value="2" />
                <label className="form-check-label" htmlFor="inlineRadio3">sehr wichtig</label>
                </div>
            </form>
            <form onChange = {this.changeGs_Verantwortung} className="row">
                <br/>
                <span className="col-2">Gesellschaftliche Verantwortung  </span>
                <div className="form-check form-check-inline Gesellschaftliche_Verantwortung">
                    <input className="form-check-input" name="Gesellschaftliche_Verantwortung" type="radio" ref={(input)=>{this.g_v0 = input}} value="0"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">unwichtig</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" name="Gesellschaftliche_Verantwortung" type="radio" ref={(input)=>{this.g_v1 = input}} value="1" />
                    <label className="form-check-label" htmlFor="inlineRadio2">wichtig</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" name="Gesellschaftliche_Verantwortung" type="radio" ref={(input)=>{this.g_v2 = input}} value="2" />
                <label className="form-check-label" htmlFor="inlineRadio3">sehr wichtig</label>
                </div>
            </form>
            <form>
                <input className="btn btn-secondary mr-1" type="button" onClick={this.absenden} value="Speichern"></input>
            </form>
        </div>
    );
  }
}