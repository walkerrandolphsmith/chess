Template.InviteForm.events({
    'click .send-invite': function() {
        var email = document.querySelectorAll("input[name='email']")[0].value;
        var message = "Invite " + email + " to play chess.";
        Session.set('invitation-text', message);
    },
    'click #invite': function(){
        var game = Template.currentData();
        var email = document.querySelectorAll("input[name='email']")[0].value;

        var invitation = {
            id: game._id,
            email: email,
            url: window.location.origin + "/signup"
        };

        return Meteor.call('sendInvite', invitation, function(error) {
            if (error) {
                Session.set('invitation-error', true);
                Session.set('invitation-success', false);
            } else {
                Session.set('invitation-error', false);
                Session.set('invitation-success', true);
            }
        });
    }
});

Template.InviteForm.helpers({
    invitationText: function(){
       return Session.get('invitation-text');
    },
    hasInvitationError: function(){
        return Session.get('invitation-error');
    },
    hasInvitationSuccess: function(){
        return Session.get('invitation-success');
    }
});