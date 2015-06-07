Template.OnOff.helpers({
    isChecked: function() {
        var settings = Template.parentData();
        var setting = Template.currentData().option;

        return settings[setting];
    }
});

Template.OnOff.events({
    "click": function(){
        var settings = Template.parentData();
        var setting = Template.currentData().option;

        var s = {};
        s[setting] = !settings[setting];

        Meteor.call('updateSettings', {
            id: settings._id,
            setting: s
        }, function(error, data){

        });
    }
});
