/*Meteor.users.remove({})
Settings.remove({})*/

Meteor.users.deny({
    update: function() {
        return true;
    }
});

Meteor.methods({
    signupUser: signupUser,
    isAlreadyUser: isAlreadyUser,
    sendInvite: sendInvitation,
    addPlayer: addPlayer,
    newGame: newGame,
    newSettings: newSettings,
    resetGame: resetGame,
    leaveGame: leaveGame,
    updateSettings: updateSettings,
    updateGame: updateGame,
    updateScore: updateScore
});

Meteor.publish("currentUserData", function() {
    return Meteor.users.find({}, {
        fields : {
            'emails': 1,
            'score' : 1
        }
    });
});

Meteor.publish('currentGameData', function(userId){
    return Games.find({players: userId});
});

Meteor.publish('currentSettingsData', function(userId){
    return Settings.find({player: userId});
});

Accounts.onCreateUser(function(option, user){
    user['score'] = {
        wins: 0,
        losses: 0
    };
    return user;
});

function signupUser(user){
    Accounts.createUser({
        email: user.email,
        password: user.password
    });
}

function isAlreadyUser(email){
    return (Meteor.users.find({"emails.address": email}, {limit: 1}).count()>0);
}

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

function addPlayer(data) {
    var gameId = data.gameId,
        playerId = data.playerId;

    var games = Games.find({players: playerId}).fetch();
    if (games.length > 0) {
        games.forEach(function (game) {
            if (game.players.length <= 1) {
                //The game is the one you're being invited to,do nothing
                if(game._id === gameId) return;
                //Game only contains the invited member delete the game.
                Games.remove({_id: game._id})
            } else {
                //Remove the invited member from a previous game.
                Games.update({_id: game._id}, {$pull: {players: playerId}})
            }
        });
    }
    Games.update({ _id: gameId }, { $push: { players: playerId } });
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
        showCoordinates: true,
        isRotated: false,
        boardColor: 0
    })
}


function resetGame(playerId){
    var game = Games.findOne({players: playerId});
    Games.update(game._id, {$set: {
        squares: Meteor.Game.generateSquares(),
        currentPlayer: game.players[0]
    }});
}

function leaveGame(playerId){
    var game = Games.findOne({players: playerId});
    var opponent = _.find(game.players, function(player){
        return playerId != player;
    });

    Games.remove(game._id);
    newGame(playerId);
    newGame(opponent);
}

function updateSettings(settings){
    var id = settings.id;
    var setting = settings.setting;
    Settings.update(id, {$set: setting});
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
    return Games.findOne({players: userId});
}

function updateScore(winnerId){
    var game = Games.findOne({players: winnerId});

    var loserId = _.find(game.players, function(player){
        return winnerId !== player;
    });

    var winner = Meteor.users.findOne({_id: winnerId});
    var loser = Meteor.users.findOne({_id: loserId});

    var wins = winner.score.wins + 1;
    var losses = loser.score.losses + 1;

    Meteor.users.update(winnerId, {$set: {"score.wins": wins}});
    Meteor.users.update(loserId, {$set: {"score.losses": losses}});
}
