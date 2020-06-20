from pymongo import MongoClient                      # https://pymongo.readthedocs.io/en/stable/tutorial.html
from textblob_de import TextBlobDE as TextBlob       # https://textblob-de.readthedocs.io/en/latest/readme.html


client = MongoClient('localhost', 3001)
db = client.meteor


mentionscollection = db.mentions
totalsentiment = 0
#wordlibrary = {}

for entry in mentionscollection.find():
    content = entry["content"]
    blob = TextBlob(content)
    textsentiment = blob.sentiment
    mentionscollection.update_one({"_id": entry["_id"]}, {"$set": {"sentiment": textsentiment[0]}})

    print(content)
    print("Sentiment: ", textsentiment[0])
    totalsentiment += textsentiment[0]

print("Gesamtsentiment: ", totalsentiment)


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
