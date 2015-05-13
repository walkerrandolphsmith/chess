Router.route('/', function () {
    this.render('Home', {
        data: {
            title: 'Chess'
        }
    });
});

Router.route('/leaderboard', function() {
    this.render('Leaderboard', {
        data: {
            title: 'Leader Board'
        }
    });
});

Router.route('/games',function () {
    this.render('Game', {
        data: {
            title: 'Game'
        }
    });
});
