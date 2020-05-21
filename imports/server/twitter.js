var Twit = require('twit')

var twitterAPI = new Twit({
	consumer_key: "yCR61JPigbhs8tQUDMjy1Bgz3", // API key
	consumer_secret: "ltkN0xgHBeUX9i3mF1fYIQAgsTNYMUc4H6ZyM7sXEvtgVt9JhT", // API secret
	access_token: "2909379863-zqmljlTQrLGZsXN4Q6lnvf7yoBZ7K6DjDl3Qm9y",
	access_token_secret: "KLocQGPdkSY9XI36f45AQGNKQ2xXSQdnoUyzmRJhjxIc7"});


function followerCount(){
	twitterAPI.get('followers/ids', { screen_name:"@FlorianKindler"},  function (err, data, response) {console.log(data)});
}
