import React, { Component } from 'react';
import Tracker from 'tracker-component';
import{ Settings_DB } from '../api/settings.js';
import { Accounts } from '../api/accounts.js';
 

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
        g_v: "1",
        sub: "",
        r_name: ""
    };
}
componentDidMount = () => {
    this.getDefault();
}

getDefault = ()=>{
    var settings = Settings_DB.find({username: Meteor.user().username}).fetch();
    var accounts = Accounts.find({username: Meteor.user().username}).fetch();
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
    if(accounts[0].sub){
        this.setState({sub: accounts[0].sub})
        this.sub.value = accounts[0].sub
    }
    if(accounts[0].r_name){
        this.setState({r_name: accounts[0].r_name})
        this.r_name.value = accounts[0].r_name
    }
        var array = ["p_d", "e", "a", "f", "v_f", "g_v"]
        for (var p = 0; p<array.length; p++){
            var value = array[p]
            var id = String(value+settings[0][value]);
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
 }

 changeEmotionen = (event) =>{
    this.setState({e: event.target.value})
 }

 changeArbeitsplatz = (event) =>{
    this.setState({a: event.target.value})
 }

 changeFinanzen = (event) =>{
    this.setState({f: event.target.value})
 }

 changeVision_und_Führung = (event) =>{
    this.setState({v_f: event.target.value})
 }

 changeGs_Verantwortung = (event) =>{
    this.setState({g_v: event.target.value})
 }
 sleep = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 absenden = async() => {
    let test = await Meteor.callPromise('updateSettings',
        Meteor.user().username,
        this.state.p_d,
        this.state.e,
        this.state.a,
        this.state.f,
        this.state.v_f,
        this.state.g_v
    )
    let test02 = await Meteor.callPromise('update_reddit', this.state.sub, this.state.r_name, Meteor.user().username)
    this.props.goToSettings();
 }

 test = () =>{
    console.log("sdfghsdfhgsdf")
    this.props.goToSettings()
 }

 abbrechen = () =>{
    this.props.goToSettings();
 }

 changeSub = (event) =>{
    this.setState({sub: event.target.value})
 }

 changeName = (event) =>{
    this.setState({r_name: event.target.value})
 }

  render() {
      //Platz für javascript (Variablen benennen und kurze Berechnungen etc, auch Logik mit if und so)
    return (
		<div className="col col-lg-7 offset-lg-3 text-left"> 
            <h2>Einstellungen</h2> 
            <hr className="mt-4 mb-4 " />
            <form onChange = {this.changeProdukt_und_Dienstleistung} className="row">
                <h6 className="col-xs-12 col-sm-5">Produkt und Dienstleistung  </h6>
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
                <h6 className="col-xs-12 col-sm-5">Emotionen  </h6>
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
                <h6 className="col-xs-12 col-sm-5">Arbeitsplatzumgebung  </h6>
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
                <h6 className="col-xs-12 col-sm-5">Finanzleistung  </h6>
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
                <h6 className="col-xs-12 col-sm-5">Vision und Führung  </h6>
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
                <h6 className="col-xs-12 col-sm-5">Gesellschaftliche Verantwortung  </h6>
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
            <br/>
            <form>
                <input className="btn btn-secondary mr-3" type="button" onClick={this.absenden} value="Speichern"></input>

                <input className="btn btn-light" type="button" onClick={this.abbrechen} value="Abbrechen"></input>
            </form>
            <br/>
            <form>
                <label for="formGroupExampleInput">Subreddit der Firma</label>
                <input type="text" className="form-control" onChange={this.changeSub} ref={(input)=>{this.sub = input}} id="formGroupExampleInput"></input>
                <br/>
                <label for="formGroupExampleInput2">Reddit Nutzername</label>
                <input type="text" className="form-control" onChange={this.changeName} ref={(input)=>{this.r_name = input}} id="formGroupExampleInput2"></input>
            </form>
        </div>
    );
  }
}