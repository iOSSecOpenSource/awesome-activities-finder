$(document).ready(function(){

  $('#signUp').click(function(){
      $.post('/sign-up', {username : $('#username').val() , password : $('#password').val()}, function(){
          location.reload();
      });
  });

  $('#login').click(function(){
      $.post('/login', {username : $('#username').val() , password : $('#password').val()}, function(){
          location.reload();
      });
  });

  $('#logout').click(function(){
      $.post('/logout', function(req,res){
          location.reload();
      });
  });

  $('#tip-submit').click(function(){
    if($('#tip-content').val().length > 0){
      var lat = 0;
      var lng = 0;
      var address = $('#tip-address').val();
      if(address.length < 1 ){
        navigator.geolocation.getCurrentPosition(function(position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          $.post('/tips', {tipContent : $('#tip-content').val(), tipLat : lat, tipLng : lng, address : address}, function(){
            location.reload();
          });
        })
      }else{
        $.post('/tips', {tipContent : $('#tip-content').val(), tipLat : lat, tipLng : lng, address : address}, function(){
          location.reload();
        });
      }
    }
  });

  $('.voteup').submit(function(e){
    e.preventDefault();
    var tipId = $(this).parent('.tip').children('.tip-id').text();
    console.log(tipId);
    var thisForm = $(this);
    $.post('/tips/'+tipId+'/voteup', function(voteCount){
      thisForm.parent('.tip').children('.tip-vote-count').text(voteCount);
    });
  });

  $('.votedown').submit(function(e){
    e.preventDefault();
    var tipId = $(this).parent('.tip').children('.tip-id').text();
     console.log(tipId);
    var thisForm = $(this);
    $.post('/tips/'+tipId+'/votedown', function(voteCount){
      //console.log(thisForm.parent('.tip').children('.tip-vote-count'));
      thisForm.parent('.tip').children('.tip-vote-count').text(voteCount);
    })
  });

  $('.tip-delete').submit(function(e){
    e.preventDefault();
    var tipId = $(this).parent('.tip').children('.tip-id').text();
    var thisForm = $(this);
    $.ajax({
      url: '/tips/'+tipId,
      type: 'DELETE'
      }).done(function(){
        thisForm.parent('.tip').remove();
      })
    });

});
