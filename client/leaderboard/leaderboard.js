Template.Leaderboard.helpers({
    players: function(){
        var players = Meteor.users.find({}, { sort: { "score.wins": -1 }});
        if(!players)
            return;
        return players.map(function(player){
            var denominator = player.score.wins + player.score.losses;
            return {
                email: (player.emails)? player.emails[0].address : player._id,
                wins: player.score.wins,
                losses: player.score.losses,
                ratio: (denominator === 0)? 0 : player.score.wins/denominator
            }
        });
    }
});