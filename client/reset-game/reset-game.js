Template.Reset.events({
    "click": function(){
        var game = Games.findOne({players: Meteor.userId()});
        Games.update(game._id, {$set: {
            squares: Meteor.Game.generateSquares(),
            currentPlayer: game.players[0]
        }});
    }
});
