Template.Aside.helpers({
    settings : function(){
        return Settings.findOne({player: Meteor.userId()});
    },
    isOpen: function(){
        return Session.get('menuOpen');
    }
});

Template.Aside.events({
    "click .reset": function(){
        var game = Games.findOne({players: Meteor.userId()});
        Games.update(game._id, {$set: {
            squares: Meteor.Game.generateSquares(),
            currentPlayer: game.players[0]
        }});
    }
});