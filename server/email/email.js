Meteor.methods({
    sendInvite: function(invitation) {

        console.log(invitation);
        var id = invitation.id;
        var email = invitation.email;
        var url =  invitation.url;

        if(isAlreadyUser(email))
            url = url.replace("signup", "signin");

        Email.send({
            to: email,
            from: "Play Chess with <dididothat@urkelforce.com>",
            subject: "Your friend invited you to play chess!",
            html: Handlebars.templates['send-invite']({
                token: id,
                url: url,
                urlWithToken: url + ("/" + id)
            })
        });

    },
    signupUser: function(user){
        Accounts.createUser({
            email: user.email,
            password: user.password
        });
    },
    isAlreadyUser: function(email){
        return isAlreadyUser(email);
    }
});

function isAlreadyUser(email){
 return (Meteor.users.find({"emails.address": email}, {limit: 1}).count()>0);
}