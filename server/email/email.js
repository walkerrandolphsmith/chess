Meteor.methods({
    sendInvite: function(invitation) {

        console.log(invitation);
        var id = invitation.id;
        var email = invitation.email;
        var url =  invitation.url;

        if(isAlreadyUser(email))
            url = url.replace("signup", "signin");

        sendEmail({
            to: email,
            from: "Play Chess with " + Meteor.User.getUsername(),
            subject:"Your friend invited you to play chess!"
        },{
            name: 'send-invite',
            data: {
                token: id,
                url: url,
                urlWithToken: url + ("/" + id)
            }
        })

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

function sendEmail(email, template){
    Email.send({
        to: email.to,
        from: email.from,
        subject: email.subject,
        html: Handlebars.templates[template.name](template.data)
    });
}

function isAlreadyUser(email){
 return (Meteor.users.find({"emails.address": email}, {limit: 1}).count()>0);
}