Template.Aside.helpers({
    settings : function(){
        return Settings.findOne({player: Meteor.userId()});
    }
});