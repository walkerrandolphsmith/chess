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