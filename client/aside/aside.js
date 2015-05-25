Template.ShowTurn.events({
    "click": function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        var showTurn = !settings.showTurn;
        Settings.update(settings._id, {$set: {showTurn: showTurn}});
    }
});

Template.ShowTurn.helpers({
   isChecked: function(){
       var settings = Settings.findOne({player: Meteor.userId()});
       return settings.showTurn;
   }
});

Template.ShowMoves.events({
    "click": function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        var showMoves = !settings.showMoves;
        Settings.update(settings._id, {$set: {showMoves: showMoves}});
    }
});

Template.ShowMoves.helpers({
    isChecked: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return settings.showMoves;
    }
});

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
    showMenu: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return (settings.showMenu)? "open" : "closed";
    }
});

