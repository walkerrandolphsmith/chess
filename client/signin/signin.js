Template.Signin.events({
    "click .signin": function (){

        var token = null;
        var tokenInput = document.querySelectorAll('input[name="token"]')[0]
        if(tokenInput)
            token = tokenInput.value;

        var user = {
            email: document.querySelectorAll('input[name="email"]')[0].value,
            password: document.querySelectorAll('input[name="password"]')[0].value,
            token: token
        };
        Meteor.loginWithPassword(user.email, user.password, function (error) {
            if (error)
                alert("LOGIN ERROR", error);
            else
                if (user.token)
                    Games.update(user.token, {$push: {players: Meteor.userId()}});
        });
    }
});

Template.Signin.helpers({
    token: function(){
        return Session.get('invitation');
    }
});