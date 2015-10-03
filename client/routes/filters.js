function checkUserLoggedIn(){
    if(!Meteor.loggingIn() && !Meteor.user()){
        Router.go('/signup');
    }else{
      this.next();
    }
}

function canLogOut(){
  if(!Meteor.loggingIn() && !Meteor.user())
      Router.go('/signup');

  Router.go('/signout');
}

function userAuthenticated(){
    if(Meteor.loggingIn())
        Router.go('/play');
    else
        this.next();
}

Router.onBeforeAction(checkUserLoggedIn, {
    except: ['index', 'signup', 'signup/:token', 'signin', "signin/:token"]
});

Router.onBeforeAction(canLogOut, {
  only: ['index']
});

Router.onBeforeAction(userAuthenticated, {
    only: ['index', 'signup', 'signup/:token', 'signin', "signin/:token"]
});
