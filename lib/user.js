Meteor.User = {
    getUser: getUser,
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

function getUser(){
    var token = null;
    var tokenInput = document.querySelectorAll('input[name="token"]')[0];
    if(tokenInput)
        token = tokenInput.value;

    return {
        email: document.querySelectorAll('input[name="email"]')[0].value,
        password: document.querySelectorAll('input[name="password"]')[0].value,
        token: token
    };
}