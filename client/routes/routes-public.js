Router.configure({
    layoutTemplate: "MasterLayout",
    loadingTemplate: "Loading",
    notFoundTemplate: "NotFound"
});

Router.route('/leaderboard', function() {
    this.render('Leaderboard', {
        data: {

        }
    });
});

Router.route('/play',function () {
    this.render('Game', {
        data: {

        }
    });
});

Router.route('index',{
    path: '/',
    template: 'Home',
    action: function(){
        this.render('Home', {
            data: {

            }
        });
    },
    onBeforeAction: function() {
        Session.set('currentRoute', 'index');
        this.next();
    }
});

/*
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
});*/
