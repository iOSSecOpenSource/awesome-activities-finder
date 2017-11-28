const yelp = require('yelp-fusion');
require('dotenv').config();

const yelpId = process.env.yelpId;
const yelpKey = process.env.yelpKey;

module.exports = function (app) {

  // const yelpPromise = yelp.accessToken(yelpId, yelpKey)
  // const rpPromise = rp(options)
  // const eventBeightPromise = eventbriteAPI({})

  /*

  Promise.all([yelpPromise, rpPromise, eventBeightPromise]).then((values) = > {
    // handle yelp results
    const yelpResults = values[0]
    handleYelp(yelpResults)

    // handle rp results
    const yelpResults = values[1]

    // handle eventbright results
    const yelpResults = values[2]

  })

  */


    app.get('/search', function(req, res) {
        res.render('search', {})
    });

    app.post('/search', function (req, res) {
      const searchRequest = {
          term: req.body.term,
          location: req.body.place
      };


      yelp.accessToken(yelpId, yelpKey).then(response => {
          const client = yelp.client(response.jsonBody.access_token);
          return client.search(searchRequest)
      }).then(response => {
          const firstResult = response.jsonBody.businesses[0];
          const prettyJson = JSON.stringify(firstResult, null, 4);
          console.log(response.jsonBody.businesses);
          return response.jsonBody.businesses
      }).then(result => {
          console.log(result.id)
          res.render('results', { yelpDatas: result })
      }).catch(err => {
          console.log(err)
      });;

        // res.redirect('/')
    });
}
