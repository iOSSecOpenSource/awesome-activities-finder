function fetchGroups(url, cb, data) {
    if(!data) data = [];
    
    $.ajax({
        
        dataType:'jsonp',
        method:'get',
        url:url,
        success:function(result) {
            console.log('back with ' + result.data.length +' results');
            console.dir(result);
            //add to data
            data.push.apply(data, result.data);
            if(result.meta.next_link) {
                var nextUrl = result.meta.next_link;
                fetchGroups(nextUrl, cb, data);
            } else {
                cb(data);   
            }
        }
    }); 
    
}

$(document).ready(function() {
    
    var $results = $("#results");

    $results.html("<p>Finding meetups with JavaScript in the description.</p>");

    fetchGroups("https://api.meetup.com/find/groups?photo-host=public&zip=94502&page=50&text=javascript&sig_id=242131561&order=newest&sig=f5dd0f30a274f1a959fd767e1848625113b4684e
&callback=?", function(res) {
        console.log("totally done");
        console.dir(res);   

        var s = "";
        for(var i=0;i<res.length; i++) {
            var group = res[i];
            s += "<h2>"+(i+1)+" <a href='"+group.link+"'>"+group.name+"</a></h2>";
            if(group.group_photo && group.group_photo.thumb_link) {
                s += "<img src=\"" + group.group_photo.thumb_link + "\" align=\"left\">";
            }
            s += "<p>Location: "+group.city + ", " + group.state + " " + group.country + "</p><br clear=\"left\">";
        }
        $results.html(s);
        
        
    });
        
});
