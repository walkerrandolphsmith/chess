Template.ToggleMenu.events({
    "click": function(){
        var isOpen = $('aside').hasClass('open');
        Session.set('menuOpen', !isOpen);
    }
});

Template.ToggleMenu.helpers({
    isOpen: function(){
      return Session.get('menuOpen');
    }
});