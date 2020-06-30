from pymongo import MongoClient                      # https://pymongo.readthedocs.io/en/stable/tutorial.html
from textblob_de import TextBlobDE as TextBlob       # https://textblob-de.readthedocs.io/en/latest/readme.html


client = MongoClient('localhost', 3001)
db = client.meteor
postcollection = db.reddit_Posts
sentimentcollection = db.reddit_NewSubreddit
accountscollection = db.accounts
s = sentimentcollection.find()

for account in accountscollection.find():
    try:
        name = account["username"]
        if sentimentcollection.find({"username":name})[0]:
            
            sentimentnegativ = 0
            sentimentneutral = 0
            sentimentpositiv = 0

            totalsentiment = 0
            counter = 0
            for content in sentimentcollection.find({"username":name})[0]["posts"]:
                counter += 1
                blob = TextBlob(content)
                textsentiment = blob.sentiment
                
                #postcollection.update_one({"_id": entry["_id"]}, {"$set": {"sentiment": textsentiment[0]}})

                if textsentiment[0] < 0:
                    sentimentnegativ += 1
                    #sentimentcollection.update_one({"username":name},{"$set": {"s_neg": sentimentnegativ}})
                elif textsentiment[0] == 0:
                    sentimentneutral += 1
                    #sentimentcollection.update_one({"username":name},{"$set": {"s_neu": sentimentneutral}})
                elif textsentiment[0] > 0:
                    sentimentpositiv += 1
                    #sentimentcollection.update_one({"username":name},{"$set": {"s_neu": sentimentneutral}})

                totalsentiment += textsentiment[0]

            #Ausgabe der Sentiments in Prozent
            onepercent = float(1 / counter)
            sentimentnegativpercent = float(sentimentnegativ) * onepercent
            #sentimentcollection.update_one({"username":name},{"$set": {"s_neg_p": sentimentnegativpercent}})
            sentimentneutralpercent = float(sentimentneutral) * onepercent
            #sentimentcollection.update_one({"username":name},{"$set": {"s_neu_p": sentimentneutralpercent}})
            sentimentpositivpercent = float(sentimentpositiv) * onepercent
            averagesentiment = totalsentiment / counter # Durchschnitt
            sentimentcollection.update({"username":name},{"$set": {
                "s_pos_p": sentimentpositivpercent, 
                "s_neu_p": sentimentneutralpercent,
                "s_neg_p": sentimentnegativpercent,
                "s_neg": sentimentnegativ,
                "s_neu": sentimentneutral,
                "s_neu": sentimentneutral,
                "s_average": averagesentiment
                }})

            #Durchschnitt des Sentiments
            #averagesentiment = totalsentiment / counter # Durchschnitt
            #sentimentcollection.update_one({"username":name},{"$set": {"s_average": averagesentiment}})
    except:
        pass


#    wordlist = blob.tokens
#    for word_entry in wordlibrary:
#        for word in wordlist:
#            if word_entry == word:
#                word_entry[0] += 1
#                wordlist.remove(word)
#    if words.length != 0:
#        for word in wordlist:
#            wordlibrary[word] = 1
#            wordlist.remove(word)

#print(wordlibrary)


# text ="Meiner Meinung nach ist die Gruppenarbeit doof

# blob = TextBlob(text)
# blob.sentences
# blob.tokens
# blob.tags
# blob.noun_phrases
# words = blob.tokens
