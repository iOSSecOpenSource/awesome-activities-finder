const yelp = require('yelp-fusion');
require('dotenv').config();

const yelpId = process.env.yelpId;
const yelpKey = process.env.yelpKey;

module.exports = function (app) {

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

          client.search(searchRequest).then(response => {
              const firstResult = response.jsonBody.businesses[0];
              const prettyJson = JSON.stringify(firstResult, null, 4);
              console.log(prettyJson);
          });
      });

        res.redirect('/')
    });
}
