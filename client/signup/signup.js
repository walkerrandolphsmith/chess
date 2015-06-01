Template.Signup.helpers({
    isLoggedIn: function(){
        return Meteor.userId();
    }
});

Template.SignupNew.helpers({
    token: function(){
        return Session.get('invitation');
    }
});

Template.Signup.events({
    "click .signup": function (){
        user = {
            email: document.querySelectorAll('input[name="email"]')[0].value,
            password: document.querySelectorAll('input[name="password"]')[0].value,
            token: document.querySelectorAll('input[name="token"]')[0].value
        };

        Meteor.call('signupUser', user, function(error){
            if(error) {
                console.log("ERROR: ", error);
            }
            else {
                Meteor.loginWithPassword(user.email, user.password, function (error) {
                    if (error) {
                        console.log("LOGIN ERROR", error);
                    }
                    else {
                        if (user.token)
                            Games.update(user.token, {$push: {players: Meteor.userId()}});
                    }
                });
            }
        })
    }
});

