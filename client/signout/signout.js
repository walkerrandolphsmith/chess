Template.Signout.events({
    "click .signout": function(){
        Meteor.logout();
    }
});