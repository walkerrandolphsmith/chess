Template.Dropdown.helpers({
    options: function(){
        var options = Template.currentData().options;
        return JSON.parse(options);
    }
});

Template.Dropdown.events({
    "click": function(event){
        var id = Template.currentData().id;
        $("#" + id).toggleClass('active');
    },
    "click ul li span": function(e){
        var settings = Template.parentData();
        var setting = Template.currentData().setting;
        var options = Template.currentData().options;
            options = JSON.parse(options);

        var option = event.target.innerHTML;
        if(!option) return;

        var index = 0;
        _.find(options, function(o, i){
            if(o === option){ index = i; return true;};
        });

        var s = {};
        s[setting] = index;

        Meteor.call('updateSettings', {
            id: settings._id,
            setting: s
        }, function(error, data){

        });
    }
});