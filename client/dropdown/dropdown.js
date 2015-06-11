Template.Dropdown.helpers({
    options: function(){
        var categories = Template.currentData().categories;
        return JSON.parse(categories);
    }
});

Template.Dropdown.events({
    "click": function(event){
        var id = Template.currentData().id;
        $("#" + id).toggleClass('active');
    },
    "click ul li": function(e){
        var option = e.target.text;
    }
});