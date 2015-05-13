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
        var game = Template.parentData();
        console.log("SQUARE: ", square);
        console.log("GAME ID: ", game._id);
        console.log("GAME: ", game);

        //Games.update(game._id, {$push: {clicks: square.position}})
    }
});

Meteor.startup(function () {
    if(Squares.find().count() === 0) {
        for(var i = 0; i < 64; i++){
            var coordinates = getCoordinatesGivenIndex(i);
            var r = coordinates.row;
            var c = coordinates.column;

            Squares.insert({
                index: i,
                coordinates: coordinates,
                position: getPosition(r,c),
                color: isDark(r, c) ? "dark" : "light",
                piece: pieces[i]
            });
        }
    }
});

function getPosition(row, column){
    var letters = ['a','b','c','d','e','f','g','h'];
    return (8 - row) + letters[column];
}

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

var pieces = {
    0: "&#9820;", //rook
    1: "&#9822;", //knight
    2: "&#9821;", //bishop
    3: "&#9818;", //queen
    4: "&#9819;", //king
    5: "&#9821;", //bishop
    6: "&#9822;", //knight
    7: "&#9820;", //rook
    8: "&#9823;", //pawn
    9: "&#9823;", //pawn
    10: "&#9823;", //pawn
    11: "&#9823;", //pawn
    12: "&#9823;", //pawn
    13: "&#9823;", //pawn
    14: "&#9823;", //pawn
    15: "&#9823;", //pawn

    48: "&#9817;", //pawn
    49: "&#9817;", //pawn
    50: "&#9817;", //pawn
    51: "&#9817;", //pawn
    52: "&#9817;", //pawn
    53: "&#9817;", //pawn
    54: "&#9817;", //pawn
    55: "&#9817;", //pawn
    56: "&#9814;", //rook
    57: "&#9816;", //knight
    58: "&#9815;", //bishop
    59: "&#9812;", //queen
    60: "&#9813;", //king
    61: "&#9815;", //bishop
    62: "&#9816;", //knight
    63: "&#9814;" //rook
};

