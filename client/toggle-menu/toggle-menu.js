Template.ToggleMenu.events({
    "click": function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        Settings.update(settings._id, {$set: {showMenu: !settings.showMenu}});
    }
});

Template.ToggleMenu.helpers({
    isOpen: function(){
        var settings = Template.currentData();
        if(!settings)
            settings = Settings.findOne({player: Meteor.userId()});
        return (settings.showMenu)? "fa-times": "fa-bars";
    },
    isOpenText: function(){
        var settings = Template.currentData();
        if(!settings)
            settings = Settings.findOne({player: Meteor.userId()});
        return (settings.showMenu)? "Close": "Open";
    }
});