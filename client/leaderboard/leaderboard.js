Template.Leaderboard.helpers({
    players: function(){
        var players = Meteor.users.find({}, { sort: { score: -1 }});
        if(!players)
            return;
        return players.map(function(player){
            return {
                email: (player.emails)? player.emails[0].address : player._id,
                score: player.score
            }
        });
    }
});