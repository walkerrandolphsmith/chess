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

function getUserFromForm(){
    var token = null;
    var tokenInput = document.querySelectorAll('input[name="token"]')[0];
    if(tokenInput)
        token = tokenInput.value;

    return {
        email: document.querySelectorAll('input[name="email"]')[0].value,
        password: document.querySelectorAll('input[name="password"]')[0].value,
        token: token
    };
}

Template.SignupForm.events({
    "keyup input": function(e){
        console.log(e);
        var email = document.querySelectorAll('input[name="email"]')[0].value;
        var password = document.querySelectorAll('input[name="password"]')[0].value;

        Meteor.call('isAlreadyUser', email, function(error, data) {
            if(error)
                console.log("ERROR", error);
            console.log(data);
            Session.set('hasErrorEmail', data);
        });
    },
    "click .signup": function (){
        var user = getUserFromForm();
        Meteor.call('signupUser', user, function(error){
            if(error) {
                console.log("ERROR: ", error);
                Session.set('hasError', true);
            }
            else {
                Meteor.loginWithPassword(user.email, user.password, function (error) {
                    if (error) {
                        console.log("LOGIN ERROR", error);
                        Session.set('hasError', true);
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



