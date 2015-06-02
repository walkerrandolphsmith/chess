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
        if(r === "signup")
            return "signin";
        else
            return "signup";
    },
    token: function(){
        return Session.get('invitation');
    }
});

Template.UserForm.events({
    "click .btn": function (){

        var token = null;
        var tokenInput = document.querySelectorAll('input[name="token"]')[0];
        if(tokenInput)
            token = tokenInput.value;

        user = {
            email: document.querySelectorAll('input[name="email"]')[0].value,
            password: document.querySelectorAll('input[name="password"]')[0].value,
            token: token
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



