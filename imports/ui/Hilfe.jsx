import React, { Component } from 'react';
import Tracker from 'tracker-component';

export class Hilfe extends Tracker.Component {

    render() {

        return (
          <div className ="hilfeseite">
            <h1>Hilfe</h1>
            <p>Auf dieser Seite finden Sie Erklärungen zu einzelnen Elementen der Anwendung.</p>
            <h4>Kategorien</h4>
            <p>Hier finden Sie genauere Informationen zu den verschiedenen Kategorien. Insgesamt gibt es 6 Kategorien, welche zusammen den Reputations Quotienten ausmachen.
            Sie sind von großer Bedeutung bei der Analyse der Online Reputation.</p>
            <h5>1. Emotionen</h5>
            <p>Sie umfasst Posts, die ihre Kunden emotional berühren. Es ist wichtig eine emotionale Bindung zwischen Ihrer Marke und Ihren Kunden aufzubauen.
            Dabei bietet es sich an, über Inhalte zu posten, mit denen sich die Leser identifizieren können.</p>
            <h5>2. Produkt und Dienstleitung</h5>
            <p>Mit Posts in dieser Kategorie haben Sie die Möglichkeit, ihr Produkt und/oder ihre Dienstleistung gut darzustellen und dafür zu werben.
              Dadurch können Ihre Kunden Sie und Ihr Produkt von einer anderen Seite kennenlernen.</p>
            <h5>3. Arbeitsplatzumgebung</h5>
            <p>Hier sind Posts einzuordnen, die ihre Arbeitsplatzumgebung positiv darstellen. Dies ist zum einen wichtig für künftige Bewerber,
            zum anderen verbessern Sie Ihre Reputation, wenn Ihre Follower Sie als Anbieter von nicht nur fairen, sondern auch attraktiven Arbeitsbedingungen wahrnehmen.</p>
            <h5>4. Finanzleistung</h5>
            <p>Hier können Sie Ihren Kunden zeigen, dass sie transparent und authentisch sind. Darüber hinaus können Sie über Spendenaktionen und Stipendien (wenn vorhanden) informieren.</p>
            <h5>5. Vision und Führung</h5>
            <p>Ihre Visionen und Gedanken können hier geteilt werden. Prototypen und neue Ideen werden Ihre Kunden begeistern. Zudem können Sie Ihre Führungsqualitäten unter Beweis stellen.</p>
            <h5>6. Gesellschaftliche Verantwortung</h5>
            <p>Klimaschutz und Faire Produktionsbedingungen werden immer wichtiger und liegen momentan im Trend.
              Deshalb ist es wichtig, dass Sie Ihren Kunden zeigen, dass Ihnen Ethik, Umweltschutz und moralische Grundsätze am Herzen liegen.</p>

            <h4>Sentiment-Analyse</h4>
            <p>Unsere Plattform analysiert das Sentiment, also die Stimmungslage, der Kommentare auf Ihre Posts. Dadurch erhalten Sie, anschaulich aufbereitet, direkt einen Überblick darüber,
            wie Ihre Posts von der Öffentlichkeit bewertet werden. Dabei ist ein neutrales Sentiment zunächst kein Grund zur Sorge,
            dennoch ist es unser Ziel Ihre Online Reputation zu verbessern und demenstprechend möglichst wenig negatives und sehr viel positives Sentiment zu generieren.
            Die Handlungsempfehlungen geben Ihnen hilfreiche Vorschläge, um dieses Ziel zu erreichen.</p>

            <h4>Handlungsempfehlungen</h4>
            <p>Die Handlungsempfehlungen sind Vorschläge, die Ihnen dabei helfen sollen Ihre Reputation zu verbessern.
            Mittels diverser Analysen schaffen wir es basierend auf den Daten Ihnen möglichst erfolgsversprechende Handlungsvorschläge zu bieten.
            In den Einstellungen ist es Ihnen möglich die Priorität der verschiedenen Kategorien individuell anzupassen, wodurch auch die Handlungsempfehlungen spezifischer auf Ihr Ziele zugeschnitten werden.</p>

            <h4>Engagement</h4>
            <p>Das Engagement gibt die Interaktion und Aktivität von Ihren Posts im Verhältnis zu Ihrer Followeranzahl an. In Kombination mit dem Sentiment können so bspw. Shitstorms frühzeitig erkannt werden.</p>
          </div>
        );
    }
}
