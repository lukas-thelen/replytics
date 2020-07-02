from pymongo import MongoClient                      # https://pymongo.readthedocs.io/en/stable/tutorial.html
from textblob_de import TextBlobDE as TextBlob       # https://textblob-de.readthedocs.io/en/latest/readme.html


client = MongoClient('localhost', 3001)
db = client.meteor
postcollection = db.reddit_Posts
#sentimentcollection = db.reddit_NewSubreddit
#accountscollection = db.accounts
#s = sentimentcollection.find()
if True:
    for post in postcollection.find(): 

        sentimentnegativ = 0
        sentimentneutral = 0
        sentimentpositiv = 0
        a = post["replies"]
        for content in post["replies"]:

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
      
        postcollection.update({"_id":post["_id"]},{"$set": {"s_pos": sentimentpositiv}})
        postcollection.update({"_id":post["_id"]},{"$set": {"s_neg": sentimentnegativ}})
        postcollection.update({"_id":post["_id"]},{"$set": {"s_neu": sentimentneutral}})
            #Durchschnitt des Sentiments
            #averagesentiment = totalsentiment / counter # Durchschnitt
            #sentimentcollection.update_one({"username":name},{"$set": {"s_average": averagesentiment}})


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
