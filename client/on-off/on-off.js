Template.OnOff.helpers({
    isChecked: function() {
        var settings = Template.parentData();
        var setting = Template.currentData().option;

        return settings[setting];
    }
});

Template.OnOff.events({
    "click": function(){
        var settings = Template.parentData();
        var setting = Template.currentData().option;
        var updatedSetting = !settings[setting];

        switch(setting){
            case "showTurn":
                Settings.update(settings._id, {$set: {showTurn: updatedSetting}});
                break;
            case "showMoves":
                Settings.update(settings._id, {$set: {showMoves: updatedSetting}});
                break;
            case "showCoordinates":
                Settings.update(settings._id, {$set: {showCoordinates: updatedSetting}});
                break;
        }
    }
});
