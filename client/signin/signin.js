Template.Signin.events({
    "click .signin": function (){
        user = {
            email: document.querySelectorAll('input[name="email"]')[0].value,
            password: document.querySelectorAll('input[name="password"]')[0].value
        };
        Meteor.loginWithPassword(user.email, user.password, function (error) {
            if (error)
                alert("LOGIN ERROR", error);
        });
    }
});

