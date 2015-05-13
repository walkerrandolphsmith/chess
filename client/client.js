Template.Board.helpers({
    squares: function(){
        return Squares.find()
    }
});

Template.Game.helpers({
    game: function(){
        return Games.findOne({players: Meteor.userId()});
    }
});

Template.Square.events({
    "click": function(){
        var square = Template.currentData();
        console.log(square.coordinate);
        console.log(Template.parentData()._id, Template.parentData());

        Games.update(Template.parentData()._id, {$push: {clicks: square.coordinate}})
    }
});

Meteor.startup(function () {
    var letters = ['a','b','c','d','e','f','g','h'];

    if(Squares.find().count() === 0) {
        for(var i = 0; i < 64; i++){
            var coordinates = getCoordinatesGivenIndex(i);
            var r = coordinates.row;
            var c = coordinates.column;

            var position = (8 - r) + letters[c];
            Squares.insert({
                coordinate: position,
                color: isDark(r, c) ? "dark" : "light",
                index: i
            });
        }
    }
});

function isDark(row, column){
    return (row % 2 != column % 2) ? true : false;
}

function getIndexGivenCoordinates(row, column) {
    return (8 * row) + column;
}

function getCoordinatesGivenIndex(index) {
    return {
        column: index % 8,
        row: Math.floor(index / 8)
    };
}

