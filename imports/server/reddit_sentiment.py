from pymongo import MongoClient                      # https://pymongo.readthedocs.io/en/stable/tutorial.html
from textblob_de import TextBlobDE as TextBlob       # https://textblob-de.readthedocs.io/en/latest/readme.html

#Zugriff auf die Datenbanken von Meteor
client = MongoClient('localhost', 3001)
db = client.meteor
postcollection = db.reddit_Posts
sentimentcollection = db.reddit_NewSubreddit
accountscollection = db.accounts

#Überprüfung der Daten für jeden Replytics-Account
for account in accountscollection.find():
    try:
        name = account["username"]
        if sentimentcollection.find({"username":name})[0]:
            
            sentimentnegativ = 0
            sentimentneutral = 0
            sentimentpositiv = 0

            totalsentiment = 0
            counter = 0

#Überprüfung der Mentions des entsprechenden Accounts
            for content in sentimentcollection.find({"username":name})[0]["posts"]:
                counter += 1
#Die Mentions wird auf ihren Sentiment hin ausgewertet
                blob = TextBlob(content)
                textsentiment = blob.sentiment
                
#Überprüfung ob der Sentiment negativ, neutral oder positiv ist mit anschließender Abspeicherung der Gesamtzahl in der Datenbank
                if textsentiment[0] < 0:
                    sentimentnegativ += 1
                elif textsentiment[0] == 0:
                    sentimentneutral += 1
                elif textsentiment[0] > 0:
                    sentimentpositiv += 1

                totalsentiment += textsentiment[0]

#Ausgabe der Sentiments in Prozent
            onepercent = float(1 / counter)
            sentimentnegativpercent = float(sentimentnegativ) * onepercent
            sentimentneutralpercent = float(sentimentneutral) * onepercent
            sentimentpositivpercent = float(sentimentpositiv) * onepercent
#Berechnung des Sentimentdurchschnitts
            averagesentiment = totalsentiment / counter
#Abspeicherung der neuen Werte in der Datenbank
            sentimentcollection.update({"username":name},{"$set": {
                "s_pos_p": sentimentpositivpercent, 
                "s_neu_p": sentimentneutralpercent,
                "s_neg_p": sentimentnegativpercent,
                "s_neg": sentimentnegativ,
                "s_neu": sentimentneutral,
                "s_neu": sentimentneutral,
                "s_average": averagesentiment
                }})

    except:
        pass
