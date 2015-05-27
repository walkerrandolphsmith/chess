Template.ToggleMenu.events({
    "click": function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        var showMenu = !settings.showMenu;
        Settings.update(settings._id, {$set: {showMenu: showMenu}});
    }
});

Template.ToggleMenu.helpers({
    isOpen: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return (settings.showMenu)? "fa-times": "fa-bars";
    },
    isOpenText: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return (settings.showMenu)? "Close": "Open";
    }
});


Template.Aside.helpers({
    settings : function(){
        return Settings.findOne({player: Meteor.userId()});
    },
    showMenu: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return (settings.showMenu)? "open" : "closed";
    }
});