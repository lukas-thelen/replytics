from pymongo import MongoClient                      # https://pymongo.readthedocs.io/en/stable/tutorial.html
from textblob_de import TextBlobDE as TextBlob       # https://textblob-de.readthedocs.io/en/latest/readme.html

#Zugriff auf die Datenbanken von Meteor
client = MongoClient('localhost', 3001)
db = client.meteor
mentionscollection = db.mentions
sentimentcollection = db.sentiment
accountscollection = db.accounts
#Leert die Sentiment Datenbank damit es nicht zu Doppelzählungen kommt
sentimentcollection.remove({})

#Überprüfung der Daten für jeden Replytics-Account
for account in accountscollection.find():
    try:
        if account["twitter_auth"]:
            name = account["username"]
            sentimentnegativ = 0
            sentimentneutral = 0
            sentimentpositiv = 0

#Einfügen der Keys für die Sentimentwerte
            sentimentcollection.insert({"username": name, "s_neg":0, "s_pos":0, "s_neu":0})

            totalsentiment = 0
            counter = 0
            
#Überprüfung der Mentions des entsprechenden Accounts
            for entry in mentionscollection.find({"username":name}):
                counter += 1
                content = entry["content"]
#Die Mentions wird auf ihren Sentiment hin ausgewertet
                blob = TextBlob(content)
                textsentiment = blob.sentiment
#Abspeicherung des Mentions Sentiment zugehörig zur Mention
                mentionscollection.update_one({"_id": entry["_id"]}, {"$set": {"sentiment": textsentiment[0]}})

#Überprüfung ob der Sentiment negativ, neutral oder positiv ist mit anschließender Abspeicherung der Gesamtzahl in der Datenbank
                if textsentiment[0] < 0:
                    sentimentnegativ += 1
                    sentimentcollection.update_one({"username":name},{"$set": {"s_neg": sentimentnegativ}})
                elif textsentiment[0] == 0:
                    sentimentneutral += 1
                    sentimentcollection.update_one({"username":name},{"$set": {"s_neu": sentimentneutral}})
                elif textsentiment[0] > 0:
                    sentimentpositiv += 1
                    sentimentcollection.update_one({"username":name},{"$set": {"s_pos": sentimentpositiv}})

                totalsentiment += textsentiment[0]

#Ausgabe der Sentiments in Prozent
            onepercent = float(1 / counter)
            sentimentnegativpercent = float(sentimentnegativ) * onepercent
            sentimentcollection.update_one({"username":name},{"$set": {"s_neg_p": sentimentnegativpercent}})
            sentimentneutralpercent = float(sentimentneutral) * onepercent
            sentimentcollection.update_one({"username":name},{"$set": {"s_neu_p": sentimentneutralpercent}})
            sentimentpositivpercent = float(sentimentpositiv) * onepercent
            sentimentcollection.update_one({"username":name},{"$set": {"s_pos_p": sentimentpositivpercent}})

#Berechnung des Sentimentdurchschnitts
            averagesentiment = totalsentiment / counter
            sentimentcollection.update_one({"username":name},{"$set": {"s_average": averagesentiment}})
    except:
        pass
