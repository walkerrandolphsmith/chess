Template.Signin.helpers({
    token: function(){
        return Session.get('invitation');
    },
    hasErrorEmail: function(){
        return Session.get('hasErrorEmail');
    },
    hasErrorPassword: function(){
        return Session.get('hasErrorPassword')
    },
    hasError: function(){
        return Session.get('hasErrorEmail') || Session.get('hasErrorPassword');
    }
});

Template.Signin.events({
    "keyup input": function(e){
        var user = Meteor.User.getUser();
        if(user.email.length === 0) {
            Session.set('hasErrorEmail', false);
        }
        else {
            Meteor.call('isAlreadyUser', user.email, function (error, data) {
                Session.set('hasErrorEmail', !data);
            });
        }
    },
    "click .signin": function(){
        var user = Meteor.User.getUser();
        Meteor.loginWithPassword(user.email, user.password, function (error) {
            if (error) {
                console.log("ERROR", error);
            }
            else if (user.token){
                Meteor.call('addPlayer', {
                    gameId: user.token,
                    playerId: Meteor.userId()
                }, function(error, data){

                });
            }
        });
    }
});
