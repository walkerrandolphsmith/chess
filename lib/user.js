Meteor.User = {
    getUsername: getUsername
};

function getUsername(){
    var username = Meteor.userId();
    var user = Meteor.users.findOne(username);
    if(user && user.emails.length > 0){
        username = user.emails[0].address;
    }
    return username;
}