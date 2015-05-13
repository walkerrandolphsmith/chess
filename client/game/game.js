Template.Game.helpers({
    game: function(){
        return Games.findOne({players: Meteor.userId()});
    }
});

Template.Board.helpers({
    squares: function(){
        return Squares.find()
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
                index: i,
                coordinates: coordinates,
                position: position,
                color: isDark(r, c) ? "dark" : "light",
                piece: {}
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
}var whitePeices = {
    queen: "&#9812;",
    king: "&#9813;",
    rook: "&#9814;",
    bishop: "&#9815;",
    knight: "&#9816;",
    pawn: "&#9817;"
};

var blackPieces = {
    queen: "&#9818;",
    king: "&#9819;",
    rook: "&#9820;",
    bishop: "&#9821;",
    knight: "&#9822;",
    pawn: "&#9823;"
};

