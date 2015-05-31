function checkUserLoggedIn(){
    console.log("check user logged in");
    if(!Meteor.loggingIn() && !Meteor.user()){
        Router.go('/signup');
    }else{
        this.next();
    }
}

Router.onBeforeAction(checkUserLoggedIn, {
    except: ['index', 'signup', 'signup/:token']
});