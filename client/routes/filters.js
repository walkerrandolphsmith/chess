function checkUserLoggedIn(){
    console.log("check user logged in");
    if(!Meteor.loggingIn() && !Meteor.user()){
        Router.go('/signup');
    }else{
        this.next();
    }
}

function userAuthenticated(){
    if(Meteor.loggingIn())
        Router.go('/play');
    else
        this.next();
}

Router.onBeforeAction(checkUserLoggedIn, {
    except: ['index', 'signup', 'signup/:token', 'signin']
});

Router.onBeforeAction(userAuthenticated, {
    only: ['index', 'signup', 'signup/:token', 'signin']
});