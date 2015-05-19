Template.Game.helpers({
    game: function(){
        return Games.findOne({players: Meteor.userId()});
    }
});

Template.Board.helpers({
    squares: function(){
        return Games.findOne({players: Meteor.userId()}).squares;
    }
});

Template.Reset.events({
    "click": function(){
        var game = Template.currentData();
        Games.update(game._id, {$set: {squares: generateSquares(), currentPlayer: game.players[0]}});
    }
});

Template.Square.events({
    "click": function(){
        var userId = Meteor.userId();
        var game = Template.parentData();
        var square = Template.currentData();
        var p = square.piece;

        console.log("USER ID: ", userId);
        console.log("GAME: ", game);

        //If its not your turn return
        if(game.currentPlayer != userId)
            return;
        //If your first tile selection has not been made
        var fromSquare = _.find(game.squares, function(square){
            return square.from
        });

        if(!fromSquare){
            //If you select an empty tile
            //on your first selection return
            if(!p)
                return;
            //If you select a tile occupied by your opponents piece
            //on your first selection return
            if(!canSelectFromSquare(p, game))
                return;
            //Set the selected piece to the from piece
            game.squares[square.index].from = "selected";
            Games.update(game._id, {$set: {squares: game.squares}});
        }else{
            //If the selected toPiece belongs to you
            if(p && canSelectFromSquare(p,game)) {
                //Reset previous from square
                _.each(game.squares, function(square){
                   square.from = "";
                });
                //set your fromPiece to the selected square
                game.squares[square.index].from = "selected";
                //Update squares and return early
                Games.update(game._id, {$set: {squares: game.squares}});
                return;
            }
            var fromPiece = fromSquare.piece;
            //Determine which squares are valid selections
            //based on the fromPiece, previously selected.
            var indicies = getValidMoves(fromSquare, game.squares);

            //Return if there is an invalid selection.
            if(!canSelectToSquare(p, game))
                return;

            //TODO: check to see if there are check conditions with King

            //Determine if the index of the selected square is in the list of valid moves
            var selectedIndexInValidMovesList = _.find(indicies, function(index){
                return square.index === index;
            });
            //Return if the selection is an invalid movement of the from piece
            if(!selectedIndexInValidMovesList)
                return;

            /*
                Once the selection has been made
            */

            //Remove the piece from the square it previously resided on
            game.squares[fromSquare.index].piece = null;
            //Replace the selected square's piece with the fromPiece
            game.squares[square.index].piece = fromPiece;
            //Set from square to false
            _.each(game.squares, function(square){
                square.from = "";
            });
            //Determine which player's turn it will be next
            var newCurrentPlayer = _.find(game.players, function(player){
                return game.currentPlayer != player;
            });
            //rotate turn to opponent and update squares
            Games.update(game._id, {$set: {currentPlayer: newCurrentPlayer, squares: game.squares}});
        }
    }
});

function canSelectFromSquare(p, g){
    return (p.id.indexOf('w') === 0 && g.currentPlayer === g.players[0])
    || (p.id.indexOf('b') === 0 && g.currentPlayer !== g.players[0])
}

function canSelectToSquare(p, g){
    return !p
        || (p.id.indexOf('w') === 0 && g.currentPlayer !== g.players[0])
        || (p.id.indexOf('b') === 0 && g.currentPlayer === g.players[0])
}

function getValidMoves(square, squares){
    var moves = [];
    var p = square.piece;
    var owner = p.id.charAt(0);

    switch(p.id.charAt(1)){
        case 'r':
            break;
        case 'k':
            break;
        case 'b':
            break;
        case 'q':
            break;
        case 'x':
            break;
        case 'p':
            var westIndex = square.index + 7;
            var index = square.index + 8;
            var double = square.index + 16;
            var eastIndex = square.index + 9;
            var intialPositions = [8,9,10,11,12,13,14,15];

            if(owner === 'w'){
                westIndex = square.index - 9;
                index = square.index -8;
                double = square.index -16;
                eastIndex = square.index -7;
                intialPositions = [48,49,50,51,52,53,54,55];
            }

            var westPiece = squares[westIndex].piece;
            var eastPiece = squares[eastIndex].piece;

            var hasWestPiece = (westPiece && isOpponent(p, westPiece));
            var hasEastPiece = (eastPiece && isOpponent(p, eastPiece));

            if(hasWestPiece){
                moves.push(westIndex)
            }
            if(hasEastPiece){
                moves.push(eastIndex)
            }
            else {
                if(_.contains(intialPositions, square.index))
                    moves.push(double);
                moves.push(index);
            }
            break;
    }
    return moves;
}

function isOpponent(from, to){
    return from.id.charAt('0') != to.id.charAt('0');
}

Meteor.startup(function () {
    Accounts.onLogin(function(){
        var userId = Meteor.userId();
        if(!Games.findOne({players: userId})){

            Games.insert({
                squares: generateSquares(),
                players: [userId],
                currentPlayer: userId
            });
        }
    });
});

function generateSquares() {
    var squares = [];
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

    for (var i = 0; i < 64; i++) {
        var coordinates = getCoordinatesGivenIndex(i);
        var r = coordinates.row;
        var c = coordinates.column;

        squares.push({
            index: i,
            coordinates: coordinates,
            position: getPosition(r, c),
            color: (r % 2 != c % 2) ? "dark" : "light",
            piece: pieces[i],
            from: ""
        });
    }
    return squares;
}

function getPosition(row, column){
    var letters = ['a','b','c','d','e','f','g','h'];
    return (8 - row) + letters[column];
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
