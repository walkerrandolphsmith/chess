Template.Signup.helpers({
    isLoggedIn: function(){
        return Meteor.userId();
    }
});

Template.UserForm.helpers({
   form: function(){
       return Session.get('currentRoute');
   },
    otherform: function(){
        var r = Session.get('currentRoute');
        return (r === "signup")? "signin" : "signup";
    },
    token: function(){
        return Session.get('invitation');
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

Template.UserForm.events({
    "click .signup": function (){
        var user = getUserFromForm();
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
    },
    "click .signin": function(){
        var user = getUserFromForm();
        Meteor.loginWithPassword(user.email, user.password, function (error) {
            if (error)
                alert("LOGIN ERROR", error);
            else
                if (user.token)
                    Games.update(user.token, {$push: {players: Meteor.userId()}});
        });
    }
});



