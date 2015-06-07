Template.Signup.helpers({
    isLoggedIn: function(){
        return Meteor.userId();
    }
});

Template.SignupForm.helpers({
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

Template.SignupForm.events({
    "keyup input": function(){
        var user = Meteor.User.getUser();
        Meteor.call('isAlreadyUser', user.email, function(error, data) {
            Session.set('hasErrorEmail', data);
        });
    },
    "click .signup": function (){
        var user = Meteor.User.getUser();
        Meteor.call('signupUser', user, function(error){
            if(error) {
                console.log("ERROR: ", error);
            }
            else {
                Meteor.loginWithPassword(user.email, user.password, function (error) {
                    if (error) {
                        console.log("LOGIN ERROR", error);
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
        })
    }
});



