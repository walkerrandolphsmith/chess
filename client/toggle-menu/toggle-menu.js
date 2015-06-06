Template.ToggleMenu.events({
    "click": function(){
        var isOpen = $('aside').hasClass('open');
        Session.set('menuOpen', !isOpen);
    }
});

Template.ToggleMenu.helpers({
    isOpen: function(){
        var isOpen = Session.get('menuOpen');
        return (isOpen)? "fa-times": "fa-bars";
    },
    isOpenText: function(){
        var isOpen = Session.get('menuOpen');
        return (isOpen)? "Close": "Open";
    }
});