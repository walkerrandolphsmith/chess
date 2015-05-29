Router.configure({
    layoutTemplate: "MasterLayout",
    loadingTemplate: "Loading",
    notFoundTemplate: "NotFound"
});

Router.route('/', function () {
    this.render('Home', {
        data: {

        }
    });
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
