Template.Play.helpers({
  game: function(){
    return Games.findOne({players: Meteor.userId()});
  },
  hasOpponent: function(){
    var game = Games.findOne({players: Meteor.userId()});
    if(game && game.players[1])
      return true;
    return false;
  }
});