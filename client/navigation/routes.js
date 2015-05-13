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

Router.route('/games',function () {
    this.render('Game', {
        data: {

        }
    });
});
