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
        var userId = Meteor.userId();
        var tm = TurnManager(game);

        console.log("USER ID: ", userId);
        console.log("GAME ID: ", game._id);
        console.log("GAME: ", game);
        console.log("SQUARE: ", square);
        console.log("TURN MANAGER: ", TurnManager(game));
        debugger;

        //If its not your turn return
        if(tm.getTurn() != userId)
            return;
        //If your first tile selection has not been made
        if(!game.fromSquare){
            var p = square.piece;
            //If you select an empty tile
            //on your first selection return
            if(!p)
                return;
            //If you select a tile occupied by your opponents piece
            //on your first selection return
            if(!canSelectFromSquare(p, tm))
                return;
            game.fromSquare = square;
        }else{
          var fromPiece = game.fromSquare.piece;
            //Determine which squares are valid selections
            //based on the fromPiece, previously selected.
            //Return if there is an invalid selection.

            //Once the selection has been made
            //Remove the piece from the square it previously resided on
            //Replace the selected square's piece with the fromPiece
            //Set game's fromSquare selected and piece properties to null
        }
        //Games.update(game._id, {$push: {clicks: square.position}})
    }
});

function canSelectFromSquare(piece, turnManager){
    return (piece.id.indexOf('w') == 0 && turnManager.isWhiteTurn())
    || (piece.id.indexOf('b') == 0 && !turnManager.isWhiteTurn())
}

function TurnManager(game){

    var turn = game.currentPlayer;

    function getTurn(){
        return turn
    }

    function setTurn(){
        turn = _.find(game.players, function(player){
            return turn != player;
        });
    }

    function isWhiteTurn(){
        var index = -1;
        _.find(game.players, function(player, i){
            if(turn === player){ index = i; return true;};
        });
        return (0 === index);
    }

    return {
        getTurn: getTurn,
        setTurn: setTurn,
        isWhiteTurn: isWhiteTurn
    }
}

Meteor.startup(function () {
    //var userId = Meteor.userId();

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

    Accounts.onLogin(function(){
        debugger;
        var userId = Meteor.userId();
        if(!Games.findOne({players: userId})){
            Games.insert({
                clicks: [],
                fromSquare: null,
                players: [userId],
                currentPlayer: userId

            });
        }
    });
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
    0:  {id: 'br', code: "&#9820;"},
    1:  {id: 'bk', code: "&#9822;"},
    2:  {id: 'bb', code: "&#9821;"},
    3:  {id: 'bq', code: "&#9818;"},
    4:  {id: 'bx', code: "&#9819;"},
    5:  {id: 'bb', code: "&#9821;"},
    6:  {id: 'bk', code: "&#9822;"},
    7:  {id: 'br', code: "&#9820;"},
    8:  {id: 'bp', code: "&#9823;"},
    9:  {id: 'bp', code: "&#9823;"},
    10: {id: 'bp', code: "&#9823;"},
    11: {id: 'bp', code: "&#9823;"},
    12: {id: 'bp', code: "&#9823;"},
    13: {id: 'bp', code: "&#9823;"},
    14: {id: 'bp', code: "&#9823;"},
    15: {id: 'bp', code: "&#9823;"},

    48: {id: 'wp', code: "&#9817;"},
    49: {id: 'wp', code: "&#9817;"},
    50: {id: 'wp', code: "&#9817;"},
    51: {id: 'wp', code: "&#9817;"},
    52: {id: 'wp', code: "&#9817;"},
    53: {id: 'wp', code: "&#9817;"},
    54: {id: 'wp', code: "&#9817;"},
    55: {id: 'wp', code: "&#9817;"},
    56: {id: 'wr', code: "&#9814;"},
    57: {id: 'wk', code: "&#9816;"},
    58: {id: 'wb', code: "&#9815;"},
    59: {id: 'wq', code: "&#9813;"},
    60: {id: 'wx', code: "&#9812;"},
    61: {id: 'wb', code: "&#9815;"},
    62: {id: 'wk', code: "&#9816;"},
    63: {id: 'wr', code: "&#9814;"}
};