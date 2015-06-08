Meteor.startup(function () {

    Meteor.subscribe("currentUserData");


    Accounts.onLogin(function(){
        var userId = Meteor.userId();

        if(!Settings.findOne({player: userId})){
            Meteor.call('newSettings', userId, function(error, data){

            });
        }

        if(!Games.findOne({players: userId})){
            Meteor.call('newGame', userId, function(error, data){

            });
        }
    });
});