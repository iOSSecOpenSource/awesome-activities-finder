require('dotenv').config();
const yelp = require('yelp-fusion');
const EVENTBRITE_token = process.env.eventbriteKEY;
const meetupapi_key = process.env.meetupapi_key;
const yelpId = process.env.yelpId;
const yelpKey = process.env.yelpKey;
module.exports = function (app) {
const yelpPromise = yelp.accessToken(yelpId, yelpKey)
const eventbritePromise = "Hello"
const meetupPromise = "Hello World"

// const api = "https://api.meetup.com/find/groups?photo-host=public&zip=94502&page=50&text=" + meetupapi_key +"&sig_id=242131561&order=newest&sig=f5dd0f30a274f1a959fd767e1848625113b4684e";

  app.get('/search', function(req, res) {
    console.log("******************** ");
    // define promises
    Promise.all([yelpPromise, eventbritePromise]).then((values) => {
      let results = {}
      // handle yelp results
      const yelpResults = values[0]
      //handleYelp(yelpResults)
      const eventbriteResults = values[1]
      // handle meetup results
      // const meetupResults = values[2]
      // handle eventbright results
      console.log(values)
      res.render('search', yelpResults)
    }).catch((err) => {
      console.log(err.message);
    })
  });


    app.post('/search', function (req, res) {
      const searchRequest = {
          term: req.body.term,
          location: req.body.place
      }
      //yelp API request
      yelp.accessToken(yelpId, yelpKey).then(response => {
          const client = yelp.client(response.jsonBody.access_token);
          return client.search(searchRequest)
      }).then(response => {
          return response.jsonBody.businesses
      }).then(result => {
          console.log(result.id)
          res.render('results', { yelpDatas: result })
      }).catch(err => {
          console.log(err)
      });
      //meetup API request
      const meetupURL = "https://api.meetup.com/find/groups?key=" + meetupapi_key +"&&sign=true&photo-host=public&zip=94502&text=javascript&page=20"; //Meetup Group with Javascript and Zip code 94502
      // get search string and append to the api
      fetch(meetupURL, { mode: 'no-cors'}).then((res) => {
        return res.json()
      }).then((json) => {
        console.log(json);
      }).catch((err) => {
        console.log(err);
      })

      //eventbrite api
      const eventbriteIDURL = "https://www.eventbriteapi.com/v3/events/search/?token=" + EVENTBRITE_token + "&q=javascript&location.address=San Francisco&page=1" //EventBrite Group with Javascript and SF Location
      fetch(eventbriteIDURL).then((res) => res.json())
      .then((data) => {
        // handle json from eventbright
        console.log(data)
      }).catch((err) => {
      console.log(err);
    })

    });
}
