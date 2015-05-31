Template.InviteForm.events({
    'click .send-invite': function() {
        var game = Template.currentData();

        var confirmInvite, invitee, url;
        invitee = {
            id: game._id,
            email: this.email
        };
        url = window.location.origin + "/signup";

        confirmInvite = confirm("Are you sure you want to invite " + this.email + "?");
        if (confirmInvite) {
            return Meteor.call('sendInvite', invitee, url, function(error) {
                if (error) {
                    return console.log(error);
                } else {
                    return alert("Invite sent to " + invitee.email + "!");
                }
            });
        }
    }
});