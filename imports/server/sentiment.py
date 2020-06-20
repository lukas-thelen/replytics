from pymongo import MongoClient                      # https://pymongo.readthedocs.io/en/stable/tutorial.html
from textblob_de import TextBlobDE as TextBlob       # https://textblob-de.readthedocs.io/en/latest/readme.html


client = MongoClient('localhost', 3001)
db = client.meteor
mentionscollection = db.mentions
sentimentcollection = db.sentiment
s = sentimentcollection.find()

sentiment = s[0]
sentimentnegativ = sentiment["s_neg"]
sentimentneutral = sentiment["s_neu"]
sentimentpositiv = sentiment["s_pos"]


totalsentiment = 0
counter = 0

for entry in mentionscollection.find():
    counter += 1
    content = entry["content"]
    blob = TextBlob(content)
    textsentiment = blob.sentiment
    mentionscollection.update_one({"_id": entry["_id"]}, {"$set": {"sentiment": textsentiment[0]}})

    if textsentiment[0] < 0:
        sentimentnegativ += 1
        sentimentcollection.update_one({},{"$set": {"s_neg": sentimentnegativ}})
    elif textsentiment[0] == 0:
        sentimentneutral += 1
        sentimentcollection.update_one({},{"$set": {"s_neu": sentimentneutral}})
    elif textsentiment[0] > 0:
        sentimentpositiv += 1
        sentimentcollection.update_one({},{"$set": {"s_pos": sentimentpositiv}})

    totalsentiment += textsentiment[0]

#Ausgabe der Sentiments in Prozent
onepercent = float(1 / counter)
sentimentnegativpercent = float(sentimentnegativ) * onepercent
sentimentcollection.update_one({},{"$set": {"s_neg%": sentimentnegativpercent}})
sentimentneutralpercent = float(sentimentneutral) * onepercent
sentimentcollection.update_one({},{"$set": {"s_neu%": sentimentneutralpercent}})
sentimentpositivpercent = float(sentimentpositiv) * onepercent
sentimentcollection.update_one({},{"$set": {"s_pos%": sentimentpositivpercent}})

#Durchschnitt des Sentiments
averagesentiment = totalsentiment / counter # Durchschnitt
sentimentcollection.update_one({},{"$set": {"s_average": averagesentiment}})


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
