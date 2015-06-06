Router.configure({
    layoutTemplate: "MasterLayout",
    loadingTemplate: "Loading",
    notFoundTemplate: "NotFound"
});

Router.route('index',{
    path: '/',
    template: 'Signup',
    onBeforeAction: function() {
        Session.set('currentRoute', 'signup');
        this.next();
    }
});

Router.route('signup',{
    path: '/signup',
    template: 'Signup',
    onBeforeAction: function() {
        console.log("Signup without token on before action");
        Session.set('currentRoute', 'signup');
        Session.set('invitation', '');
        this.next();
    }
});

Router.route('signup/:token',{
    path: '/signup/:token',
    template: 'Signup',
    onBeforeAction: function() {
        console.log("Sign up with token on before action");
        Session.set('currentRoute', 'signup');
        Session.set('invitation', this.params.token);
        this.next();
    }
});

Router.route('signin',{
    path: '/signin',
    template: 'Signin',
    onBeforeAction: function() {
        console.log("Signin before action");
        Session.set('currentRoute', 'signin');
        Session.set('invitation', '');
        this.next();
    }
});

Router.route('signin/:token',{
    path: '/signin/:token',
    template: 'Signin',
    onBeforeAction: function() {
        console.log("Sign in with token on before action");
        Session.set('currentRoute', 'signin');
        Session.set('invitation', this.params.token);
        this.next();
    }
});
