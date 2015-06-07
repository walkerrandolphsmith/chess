Meteor.methods({
    sendInvite: sendInvitation,
    signupUser: signupUser,
    isAlreadyUser: isAlreadyUser,
    resetGame: resetGame,
    updateSettings: updateSettings,
    updateGame: updateGame,
    addPlayer: addPlayer,
    newGame: newGame,
    newSettings: newSettings
});

function sendInvitation(invitation){
    console.log(invitation);
    var id = invitation.id;
    var email = invitation.email;
    var url =  invitation.url;

    if(isAlreadyUser(email))
        url = url.replace("signup", "signin");

    sendEmail({
        to: email,
        from: "Play Chess with " + Meteor.User.getUsername(),
        subject:"Your friend invited you to play chess!"
    },{
        name: 'send-invite',
        data: {
            token: id,
            url: url,
            urlWithToken: url + ("/" + id)
        }
    });
}

function sendEmail(email, template){
    Email.send({
        to: email.to,
        from: email.from,
        subject: email.subject,
        html: Handlebars.templates[template.name](template.data)
    });
}

function isAlreadyUser(email){
 return (Meteor.users.find({"emails.address": email}, {limit: 1}).count()>0);
}

function signupUser(user){
    Accounts.createUser({
        email: user.email,
        password: user.password
    });
}

function resetGame(playerId){
    var game = Games.findOne({players: playerId});
    Games.update(game._id, {$set: {
        squares: Meteor.Game.generateSquares(),
        currentPlayer: game.players[0]
    }});
}

function updateSettings(settings){
    var id = settings.id;
    var setting = settings.setting;
    var value = settings.value;

    switch(setting){
        case "showTurn":
            Settings.update(id, {$set: {showTurn: value}});
            break;
        case "showMoves":
            Settings.update(id, {$set: {showMoves: value}});
            break;
        case "showCoordinates":
            Settings.update(id, {$set: {showCoordinates: value}});
            break;
    }
}

function updateGame(data){

    var userId = data.userId,
        squares = data.squares,
        isTurnChange = data.isTurnChange;

    var game = Games.findOne({players: userId});

    if(isTurnChange){
        var newCurrentPlayer = _.find(game.players, function(player){
            return game.currentPlayer != player;
        });
        Games.update(game._id, {$set: {currentPlayer: newCurrentPlayer, squares: squares}});
    }else{
        Games.update(game._id, {$set: {squares: squares}});
    }
}

function addPlayer(data){
    var gameId = data.gameId,
        playerId = data.playerId;

        var games = Games.find({players: playerId}).fetch();
        if(games.length > 0) {
            games.forEach(function (game) {
                if(game.players.length <=1) {
                    //Game only contains the invited member delete the game.
                    Games.remove({_id: game._id})
                }else{
                    //Remove the invited member from a previous game.
                    Games.update(game._id, {$pull: {players: playerId}})
                }
            });
        }
        Games.update(gameId, {
            $push: {
                players: {
                    $each: [playerId],
                    $position: 1
                }
            }
        });
}

function newGame(userId){
    Games.insert({
        squares: Meteor.Game.generateSquares(),
        players: [userId],
        currentPlayer: userId
    });
}

function newSettings(userId){
    Settings.insert({
        player: userId,
        showTurn: true,
        showMoves: true,
        showCoordinates: true
    })
}