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
        var updatedSetting = !settings[setting];

        Meteor.call('updateSettings', {
            id: settings._id,
            setting: setting,
            value: updatedSetting
        }, function(error, data){

        });
    }
});
