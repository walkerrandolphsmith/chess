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

            //Determine which squares are valid selections
            var indicies = getValidMoves(square, game.squares);
            _.each(game.squares, function(square){
               square.isValid = "invalid";
            });
            _.each(indicies, function(index){
               game.squares[index].isValid = "valid";
            });

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

                //Determine which squares are valid selections
                //based on the newly selected square
                indicies = getValidMoves(square, game.squares);
                _.each(game.squares, function(square){
                    square.isValid = "invalid";
                });
                _.each(indicies, function(index){
                    game.squares[index].isValid = "valid";
                });

                //Update squares and return early
                Games.update(game._id, {$set: {squares: game.squares}});
                return;
            }
            var fromPiece = fromSquare.piece;

            var validSquares = _.filter(game.squares, function(square){
                return square.isValid === "valid";
            });

            indicies = _.map(validSquares, function(square){
                return square.index;
            });

            //Return if there is an invalid selection.
            if(!canSelectToSquare(p, game))
                return;

            //TODO: check to see if there are check conditions with King

            //Determine if the index of the selected square is in the list of valid moves
            var selectedIndexInValidMovesList = _.find(indicies, function(index){
                return square.index === index;
            });
            //Return if the selection is an invalid movement of the from piece
            if(!selectedIndexInValidMovesList && selectedIndexInValidMovesList !== 0)
                return;

            /*
                Once the selection has been made
            */

            //Remove the piece from the square it previously resided on
            game.squares[fromSquare.index].piece = null;
            //Replace the selected square's piece with the fromPiece
            game.squares[square.index].piece = fromPiece;
            //Set from square to false and movement to this square to invalid
            _.each(game.squares, function(square){
                square.from = "";
                square.isValid = "invalid"

                var isMyPiece = false;
                if(square.piece) {
                    isMyPiece = canSelectFromSquare(square.piece, game);
                    //Set to the opposite value since the turn is about to be rotated.
                    (isMyPiece) ? square.my = "their" : square.my = "my";
                }
                else {
                    square.my = ""
                }
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

function getRookMoves(square, squares){
    var moves = [];
    var p = square.piece,
        r = square.coordinates.row,
        c = square.coordinates.column;

    //From first row to the current row
    var nextIndex = square.index;
    for(var i = r; i > 0 ; i--){
        nextIndex -= 8;
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    //From current row to last row
    nextIndex = square.index;
    for(var i = r; i < 7; i++){
        nextIndex += 8;
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    //From current column to first column
    nextIndex = square.index;
    for(var i = c; i > 0; i--){
        nextIndex -= 1;
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    //From current column to last column
    nextIndex = square.index;
    for(var i = c; i < 7; i++){
        nextIndex += 1;
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    return moves;
}

function getBishopMoves(square, squares){
    var moves = [];
    var p = square.piece,
        r = square.coordinates.row,
        c = square.coordinates.column,
        nextIndex, rr, cc, i;

    //NorthWest
    for(i = 1, rr = r, cc = c; rr > 0 && cc > 0; i++, rr--, cc--){
        nextIndex = square.index - (i * 9);
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    //NorthEast
    for(i = 1, rr = r, cc = c; rr > 0 && cc < 7; i++, rr--, cc++){
        nextIndex = square.index - (i * 7);
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    //Southwest
    for(i = 1, rr = r, cc = c; rr < 7 && cc > 0; i++, rr++, cc--){
        nextIndex = square.index + (i * 7);
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    //Southeast
    for(i = 1, rr = r, cc = c; rr < 7 && cc < 7; i++, rr++, cc++){
        nextIndex = square.index + (i * 9);
        var toSquare = getToSquare(nextIndex, square, squares);
        if(toSquare.isValid)
            moves.push(nextIndex);
        if(toSquare.hasPiece)
            break;
    }
    return moves;
}

function getPawnMoves(square, squares){
    var p = square.piece;
    var moves = [];

    var westIndex = square.index + 7;
    var index = square.index + 8;
    var double = square.index + 16;
    var eastIndex = square.index + 9;
    var initialPositions = [8,9,10,11,12,13,14,15];

    if(p.id.charAt(0) === 'w'){
        westIndex = square.index - 9;
        index = square.index - 8;
        double = square.index - 16;
        eastIndex = square.index - 7;
        initialPositions = [48,49,50,51,52,53,54,55];
    }

    var leftMostColumn = (square.coordinates.column === 0);
    var rightMostColumn = (square.coordinates.column === 7);

    var toWestSquare = getToSquare(westIndex, square, squares);
    var toEastSquare = getToSquare(eastIndex, square, squares);


    if(!leftMostColumn && toWestSquare.isValid && toWestSquare.hasPiece)
        moves.push(westIndex);
    if(!rightMostColumn && toEastSquare.isValid && toEastSquare.hasPiece)
        moves.push(eastIndex);
    if(squares[index] && !squares[index].piece) {
        moves.push(index);
        if (squares[double] && !squares[double].piece && _.contains(initialPositions, square.index))
            moves.push(double);
    }
    return moves;
}

function getKnightMoves(square, squares){
    var moves = [],
        i = square.index;
    var directions = [];

    if(square.coordinates.column !== 0){
        directions.push(i-17);
        directions.push(i+15);

    }
    if(square.coordinates.column > 1){
        directions.push(i-10);
        directions.push(i+6);
    }

    if(square.coordinates.column !== 7){
        directions.push(i-15);
        directions.push(i+17);
    }
    if(square.coordinates.column < 6){
        directions.push(i-6);
        directions.push(i+10);
    }

    directions.forEach(function(index){
        if(getToSquare(index, square, squares).isValid)
            moves.push(index)
    });
    return moves;
}

function getKingMoves(square, squares){
    var moves = [],
        i = square.index;
    var directions = [i-8, i+8];

    if(square.coordinates.column !== 7) {
        directions.push(i + 1);
        directions.push(i - 7);
        directions.push(i + 9);
    }

    if(square.coordinates.column !== 0){
        directions.push(i - 1);
        directions.push(i - 9);
        directions.push(i + 7);
    }

    directions.forEach(function(index){
        if(getToSquare(index, square, squares).isValid)
            moves.push(index)
    });
    return moves;
}

function getToSquare(i, square, squares){
    var isValidMove = false;
    var hasPiece = false;
    if(squares[i]){
        var nextPiece = squares[i].piece;
        if(nextPiece){
            if(isOpponent(square.piece, nextPiece))
                isValidMove = true;
            hasPiece = true;
        }else{
            isValidMove = true;
        }
    }
    return {isValid: isValidMove, hasPiece: hasPiece};
}

function isOpponent(from, to){
    return from.id.charAt('0') != to.id.charAt('0');
}

function getValidMoves(square, squares){
    var moves = [];
    //square is the from square
    var p = square.piece;
    var owner = p.id.charAt(0);

    switch(p.id.charAt(1)){
        case 'r':
            moves = getRookMoves(square, squares);
            break;
        case 'k':
            moves = getKnightMoves(square, squares);
            break;
        case 'b':
            moves = getBishopMoves(square, squares);
            break;
        case 'q':
            moves = _.union(getRookMoves(square, squares), getBishopMoves(square, squares));
            break;
        case 'x':
            moves = getKingMoves(square, squares);
            break;
        case 'p':
            moves = getPawnMoves(square, squares);
            break;
    }
    return moves;
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
        3:  {id: 'bq', code: "&#9819;"},
        4:  {id: 'bx', code: "&#9818;"},
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
            from: "",
            isValid: "invalid",
            my: ""
        });

    }

    _.each(squares, function(square){
        if(square.index > 47){
            square.my = "my";
        }else if(square.index < 16){
            square.my = "their";
        }else {
            square.my = "";
        }
    });
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
