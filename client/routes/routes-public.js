Router.configure({
    layoutTemplate: "MasterLayout",
    loadingTemplate: "Loading",
    notFoundTemplate: "NotFound"
});

Router.route('index',{
    path: '/',
    template: 'Signup',
    onBeforeAction: function() {
        Session.set('currentRoute', 'index');
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
