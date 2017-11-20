const TipModel = require('../db/models/index').Tip;
const UserModel = require('../db/models/index').User;
const VoteModel = require('../db/models/index').Vote;

module.exports = function (app) {
    //GET all tip locations for map markers
    app.get('/tips', function(req,res) {
        TipModel.findAll({
        }).then((tips) => {
            res.send(tips);
        })
    });

    //GET new tip form
    app.get('/tips/new', function (req, res) {
        res.render('tips-new', {})
    });

    //GET individual tips
    app.get('/tips/:id', function (req, res) {
        TipModel.findById(req.params.id).then((tip) => {
            res.render('tips-show', { tip: tip })
        })
    });


    //GET tips edit form
    app.get('/tips/:id/edit', function (req, res) {
        TipModel.findById(req.params.id).then((tip) => {
            res.render('tips-edit', { tip: tip })
        })
    }); 


    //POST create new tips
    app.post('/tips', function (req, res) {
      // TODO :: ADD VALIDATION, CHECK FORM IN NOT EMPTY
        TipModel.create({
            body : req.body.tipContent,
            longitude : req.body.tipLng,
            latitude : req.body.tipLat,
            UserId: req.user.id,
            address : req.body.address
        }).catch(function (err) {
            console.log(err)
        });

        res.redirect('/')
    });

    //PUT edit tips
    app.put('/tips/:id', function (req, res) {
        // console.log(req.body);
        TipModel.findByIdAndUpdate(req.params.id, req.body, function (err, tip) {
            res.redirect('/tips/' + tip._id)
        })
    });


    //Get Vote Count of Tip
    app.get('/tips/:id/votes', function(req,res){
      TipModel.findById(req.params.id).then(function(tip){
        res.send(tip.vote);
      });
    });

    //Post update vote
    app.post('/tips/:id/voteup', function (req, res) {
      VoteModel.findOne({where : {TipId : req.params.id, UserId : req.user.id} } ).then(function(vote){
        if(!vote){
          VoteModel.create({TipId : req.params.id, UserId : req.user.id, votePositive : true}).then(function(){
            TipModel.findById(req.params.id).then(function(tip){
              tip.countVotes(function(voteCount){
                tip.update({vote : voteCount});
                res.send(String(voteCount));
              })
            });
          })
        }else{
          vote.update({votePositive : true}).then(function(){
            TipModel.findById(req.params.id).then(function(tip){
              tip.countVotes(function(voteCount){
                tip.update({vote : voteCount});
                res.send(String(voteCount));
              })
            });
          });
        }
      })
    });

    //Post down vote
    app.post('/tips/:id/votedown', function (req, res) {
        VoteModel.findOne({where : {TipId : req.params.id, UserId : req.user.id} }).then(function(vote){
          if(!vote){
            VoteModel.create({TipId : req.params.id, UserId : req.user.id, votePositive : false}).then(function(){
              TipModel.findById(req.params.id).then(function(tip){
                tip.countVotes(function(voteCount){
                  tip.update({vote : voteCount});
                  res.send(String(voteCount));
                })
              });
            })
          }else{
            vote.update({votePositive : false}).then(function(){
              TipModel.findById(req.params.id).then(function(tip){
                tip.countVotes(function(voteCount){
                  tip.update({vote : voteCount});
                  res.send(String(voteCount));
                })
              });
            })
          }
        })
    });

    //DELETE tips
    app.delete('/tips/:id', function (req, res) {
        TipModel.findById(req.params.id).then((tip) => {
            tip.destroy(function(result) {
              console.log(result);
            });
            res.send();
        })
    })

};
