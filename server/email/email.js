Meteor.methods({
    sendInvite: function(invitee, url) {
        var email = invitee.email;
        var token =  invitee.id;

    }
});


/*Email.send({
    to: invitee.email,
    from: "Urkelforce Beta Invitation <dididothat@urkelforce.com>",
    subject: "Welcome to the Urkelforce Beta!",
    html: Handlebars.templates['send-invite']({
        token: token,
        url: url,
        urlWithToken: url + ("/" + token)
    })
});*/