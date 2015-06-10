Template.Dropdown.helpers({
    options: function(){
        var categories = Template.currentData().categories;
        return JSON.parse(categories);
    }
});