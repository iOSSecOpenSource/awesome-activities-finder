function getEvents(organizers,token) {
    var def = $.Deferred();
    if(organizers.constructor !== Array) {
        organizers = [organizers];
    }
    
    var defs = [];
    for(var i=0;i<organizers.length;i++) {
        defs.push($.get('https://www.eventbriteapi.com/v3/events/search/?token='+token+'&organizer.id='+organizers[i]+'&expand=venue'));
    }
    var data = [];
    $.when.apply($, defs).done(function() {
        // when we had one deferred, arguments is 'normal'
        // when we have 2+, its one argument array per result
        if(organizers.length === 1) {
            def.resolve(arguments[0].events);
        } else {
            for(var i=0;i<arguments.length;i++) {
                data.push.apply(data, arguments[i][0].events);
            }
            data.sort(function(a,b) {
                var aDate = new Date(a.start.utc);
                var bDate = new Date(b.start.utc);
                return aDate > bDate;
            });
            def.resolve(data);
        }
    });
    return def.promise();

}
