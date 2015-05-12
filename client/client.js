

Template.board.helpers({
    squares: function(){
        return Squares.find()
    }
});

Template.game.helpers({
    game: function(){
        return Games.findOne({players: Meteor.userId()});
    }
});

Meteor.startup(function () {
    var letters = ['a','b','c','d','e','f','g','h'];


    if(Squares.find().count() === 0) {
        for(var i = 0; i < 64; i++){
            var coordinates = getCoordinatesGivenIndex(i);
            var position = (8 - coordinates.row) + letters[coordinates.column];
            Squares.insert({
                coordinate: position,
                color: isDark(i) ? "dark" : "light",
                index: i
            });
        }
    }
});

function isDark(index) {
    var pos = getCoordinatesGivenIndex(index);

    var isRowEven = pos.row % 2;
    var isColumnEven = pos.column % 2;

    return (isRowEven != isColumnEven) ? true : false;
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

Template.square.events({
    "click": function(){
        var square = Template.currentData();
        console.log(square.coordinate);
        console.log(Template.parentData()._id, Template.parentData());

        Games.update(Template.parentData()._id, {$push: {clicks: square.coordinate}})
    }
});