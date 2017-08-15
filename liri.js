//liri commands:
// 'my-tweets'
// 'spotify-this-song'
// 'movie-this'
// 'do-what-it-says'

// Include the request npm package
var Spotify = require('node-spotify-api');
var twitter = require('twitter');
var request = require("request");
var fs = require('fs');
//code to grab data from keys.js file
var keys = require("./keys.js");

//Grab the userInput which will always be the third node arg.
var userInput = process.argv.slice(3).join("+");
//index-2 command line argument will always be liri 
var index2 = process.argv[2];

// spotify setup ==============================================================  
var spotify = new Spotify({
  id: '0b8ce1fbada94f65a876eba9207451c7',
  secret: '528c942b9f754a1db6fbb1a6d8c4421d'
}); 
 
function spotifyThis(){
  if(!userInput){
        userInput = "i saw the sign";
  }  
  spotify.search(
    { type: "track", query: userInput,},
    function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }else{
        console.log("\r\n" + "========================= Your Song =========================" + "\r\n");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview Here: " + data.tracks.items[0].preview_url);
        //log to log.txt file
        Log(data.tracks.items[0].artists[0].name + "\r\n" + data.tracks.items[0].name + "\r\n" + 
        data.tracks.items[0].album.name + "\r\n" + data.tracks.items[0].preview_url);
      }
  });       
};
// twitter setup =============================================================
var params = {screen_name: userInput, count: 20};
var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

function tweet(){
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for(var i = 0; i < tweets.length; i++) {
          //console.log(response); // Show the full response in the terminal
          var twitterTweets = 
          "@" + tweets[i].user.screen_name + ": " + 
          tweets[i].text + "\r\n" + 
          "created: " + tweets[i].created_at  
          console.log("\r\n" + "========================= Your Tweets =========================" + "\r\n");
          console.log(twitterTweets); 
          //log to log.txt file      
          Log (twitterTweets);   
      }
    }  
  });
}
// movie setup ===============================================================
//run a request to the OMDB API with the movie specified
function movie(){
  if(!userInput){
        userInput = "mr nobody";
  } 
  var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=40e9cece";
   
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover indivually  
      console.log("\r\n" + "========================= Your Movie =========================" + "\r\n");
      console.log("Title of Movie: " + JSON.parse(body).Title);
      console.log("Year Released: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language used: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("==============================================================");
      //log to log.txt file
      Log (JSON.parse(body).Title + JSON.parse(body).Year + JSON.parse(body).Ratings[0].Value
        +JSON.parse(body).Ratings[1].Value + JSON.parse(body).Country + JSON.parse(body).Language
        + JSON.parse(body).Plot + JSON.parse(body).Actors);
    } 
  });
}
// whatItSays setup ===============================================================
function whatItSays(){
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
    return console.log(error);
    }
    //console.log(data);
    var dataArr = data.split(',');
        index2 = dataArr[0];
        userInput = dataArr[1];
        spotifyThis()
  });
}
// logging results to seperate text file =====================================
function Log(incoming) {
  var data = incoming; //empty array to hold data
  fs.appendFileSync("log.txt",JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

// switch statements to run code on commands ==================================
switch(index2){
  case "spotify-this-song":
  spotifyThis();
  break;

  case "my-tweets":
  tweet();
  break;

  case "movie-this":
  movie();
  break;

  case 'do-what-it-says':
  whatItSays();
  break; 

  default:
  console.log("Liri wants you to try again!");     
}