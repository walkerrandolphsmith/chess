Template.InviteForm.events({
    'click .send-invite': function() {

        var game = Template.currentData();
        var email = document.querySelectorAll("input[name='email']")[0].value;

        var invitation = {
            id: game._id,
            email: email,
            url: window.location.origin + "/signup"
        };

        var confirmInvite = confirm("Are you sure you want to invite " + email + "?");

        if (confirmInvite) {
            return Meteor.call('sendInvite', invitation, function(error) {
                if (error) {
                    return console.log("ERROR: ", error);
                } else {
                    return alert("Invite sent to " + invitation.email + "!");
                }
            });
        }
    }
});