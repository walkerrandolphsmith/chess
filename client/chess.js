Meteor.startup(function () {

    Accounts.onLogin(function(){
        var userId = Meteor.userId();

        if(!Settings.findOne({player: userId})){

            Settings.insert({
                player: userId,
                showTurn: true,
                showMoves: true,
                showCoordinates: true,
                showMenu: false
            })
        }

        if(!Games.findOne({players: userId})){
            Games.insert({
                squares: Meteor.Game.generateSquares(),
                players: [userId],
                currentPlayer: userId
            });
        }
    });
});