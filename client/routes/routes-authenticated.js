Router.route('play',{
    path: '/play',
    template: 'Play',
    onBeforeAction: function() {
        Session.set('currentRoute', 'play');
        Meteor.subscribe("currentGameData", Meteor.userId());
        Meteor.subscribe("currentSettingsData", Meteor.userId());
        this.next();
    }
});

Router.route('leaderboard',{
    path: '/leaderboard',
    template: 'Leaderboard',
    onBeforeAction: function() {
        Session.set('currentRoute', 'leaderboard');
        Meteor.subscribe("currentSettingsData", Meteor.userId());
        this.next();
    }
});

Router.route('signout', {
  path: '/signout',
  template: 'Signout',
  onBeforeAction: function() {
      Meteor.subscribe("currentSettingsData", Meteor.userId());
      this.next();
  }
});
