Template.Signout.events({
    "click .signout": function(){
        Meteor.logout();
    }
});

Template.Signout.helpers({
   username: Meteor.User.getUsername
});