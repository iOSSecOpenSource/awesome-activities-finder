require('dotenv').config();

const yelp = require('yelp-fusion');
const EVENTBRITE_ID = process.env.eventbriteID;
const EVENTBRITE_token = process.env.eventbriteKEY;

const ROOT_URL = 'https://www.eventbriteapi.com/v3/events/search/';
const meetupapi_key = process.env.meetupapi_key;

const yelpId = process.env.yelpId;
const yelpKey = process.env.yelpKey;

module.exports = function (app) {

const yelpPromise = yelp.accessToken(yelpId, yelpKey)


  app.get('/search', function(req, res) {

    // define promises

    Promise.all([yelpPromise, meetupPromise, eventBeightPromise]).then((values) => {
      let results = {}
      // handle yelp results
      const yelpResults = values[0]
      //handleYelp(yelpResults)
      // handle meetup results
      const meetupResults = values[1]


      // handle eventbright results
      const eventbriteResults = values[2]

      res.render('search', yelpResults)
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
          // const firstResult = response.jsonBody.businesses[0];
          // const prettyJson = JSON.stringify(firstResult, null, 4);
          // console.log(response.jsonBody.businesses);
          return response.jsonBody.businesses
      }).then(result => {
          console.log(result.id)
          res.render('results', { yelpDatas: result })
      }).catch(err => {
          console.log(err)
      });

      //meetup API request
      const api = "https://api.meetup.com/find/groups?photo-host=public&zip=94502&page=50&text=" + meetupapi_key +"&sig_id=242131561&order=newest&sig=f5dd0f30a274f1a959fd767e1848625113b4684e";
      // get search string and append to the api
      fetch(api).then((res) => {
        return res.json()
      }).then((json) => {
        // meetup json ...

      }).catch((err) => {
        console.log(err);
      })
      //eventbrite api
      let url = "https://www.eventbriteapi.com/v3/events/search/?token=" + EVENTBRITE_token + "&q=javascript&location.address=San Francisco&page=1"
      fetch(url).then((res) => {
        return res.json()
      }).then((json) => {
        // handle json from eventbright

      }).catch((err) => {
      console.log(err);
    })
    });
}
