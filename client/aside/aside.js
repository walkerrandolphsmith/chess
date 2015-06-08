Template.Aside.helpers({
    settings : function(){
        return Settings.findOne({player: Meteor.userId()});
    },
    isOpen: function(){
        return Session.get('menuOpen');
    }
});

Template.Aside.events({
    "click #reset": function(){
        var userId = Meteor.userId();
        Meteor.call('resetGame', userId, function(error, data){

        });
    }
});