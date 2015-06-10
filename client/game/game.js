Template.Board.events({
    "click #checkmate-reset": function(){
        var userId = Meteor.userId();
        Meteor.call('resetGame', userId, function(error, data){

        });
    },
    "click #checkmate-leave": function(){
        var userId = Meteor.userId();
        Meteor.call('leaveGame', userId, function(error, data){

        });
    }
});

Template.Board.helpers({
    squares: function(){
        return Games.findOne({players: Meteor.userId()}).squares;
    },
    currentTurn: function(){
        var game = Games.findOne({players: Meteor.userId()});
        return (game.currentPlayer === game.players[0]);
    },
    showTurn: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return settings.showTurn;
    },
    showMoves: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return settings.showMoves;
    },
    showCoordinates: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return settings.showCoordinates;
    },
    isRotated: function(){
        var settings = Settings.findOne({player: Meteor.userId()});
        return settings.isRotated;
    }
});

Template.Square.helpers({
    empty: function(){
        var s = Template.currentData();
        var p = s.piece;
        return !p;
    },
    selectable: function(){
        var userId = Meteor.userId();
        var g = Template.parentData();
        var s = Template.currentData();
        var p = s.piece;

        return (p && (
                   (p.id.indexOf('w') === 0 && g.currentPlayer === g.players[0] && g.currentPlayer === userId)
                || (p.id.indexOf('b') === 0 && g.currentPlayer !== g.players[0] && g.currentPlayer === userId)
            ));

    },
    isDarkPiece: function(){
        var s = Template.currentData();
        var p = s.piece;
        return (p && p.id.indexOf('b') === 0);
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
            game.squares[square.index].from = true;

            //Determine which squares are valid selections
            var indicies = getValidMoves(square, game.squares);
            _.each(game.squares, function(square){
               square.isValid = false;
            });
            _.each(indicies, function(index){
               game.squares[index].isValid = true;
            });

            Meteor.call('updateGame', {
                userId: userId,
                squares: game.squares,
                isTurnChange: false
            }, function(error, data){

            });
        }
        else{
            //If the selected toPiece belongs to you
            if(p && canSelectFromSquare(p,game)) {
                //Reset previous from square
                _.each(game.squares, function(square){
                   square.from = "";
                });
                //set your fromPiece to the selected square
                game.squares[square.index].from = true;

                //Determine which squares are valid selections
                //based on the newly selected square
                indicies = getValidMoves(square, game.squares);
                _.each(game.squares, function(square){
                    square.isValid = false;
                });
                _.each(indicies, function(index){
                    game.squares[index].isValid = true;
                });

                //Update squares and return early
                Meteor.call('updateGame', {
                    userId: userId,
                    squares: game.squares,
                    isTurnChange: false
                }, function(error, data){

                });
                return;
            }
            var fromPiece = fromSquare.piece;

            var validSquares = _.filter(game.squares, function(square){
                return square.isValid;
            });

            indicies = _.map(validSquares, function(square){
                return square.index;
            });

            //Return if there is an invalid selection.
            if(!canSelectToSquare(p, game))
                return;

            //Determine if the index of the selected square is in the list of valid moves
            var selectedIndexInValidMovesList = _.find(indicies, function(index){
                return square.index === index;
            });
            //Return if the selection is an invalid movement of the from piece
            if(!selectedIndexInValidMovesList && selectedIndexInValidMovesList !== 0)
                return;

            //Once the selection has been made

            //Remove the piece from the square it previously resided on
            game.squares[fromSquare.index].piece = null;
            //Replace the selected square's piece with the fromPiece
            game.squares[square.index].piece = fromPiece;
            //Set from square to false and movement to this square to invalid
            _.each(game.squares, function(square){
                square.from = false;
                square.isValid = false;
            });

            //rotate turn to opponent and update squares
            Meteor.call('updateGame', {
                userId: userId,
                squares: game.squares,
                isTurnChange: true
            }, function(error, data){
                var owner = data.squares[square.index].piece.id.charAt(0);
                var opponent = (owner === 'w') ? 'b' : 'w';
                if(isCheckCondition(opponent, data.squares)){
                    Meteor.call('updateScore', userId, function(error,data){

                    });
                    $('#checkmate').modal();
                }
            });
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
    var movesToRemove = movesThatCauseCheck(moves, square, squares);
    return _.difference(moves, movesToRemove);
}

function movesThatCauseCheck(moves, square ,squares){
    var movesToRemove = [];
    var originalIndex = square.index;
    var originalPiece = square.piece;

    _.each(moves, function(index){
        var toSquarePiece = squares[index].piece;
        squares[index].piece = originalPiece;
        squares[originalIndex].piece = null;


        var owner = squares[index].piece.id.charAt(0);
        var isCheck = isCheckCondition(owner, squares);

        squares[originalIndex].piece = originalPiece;
        squares[index].piece = toSquarePiece;

        if(isCheck)
            movesToRemove.push(index);
    });
    return movesToRemove;
}



function isCheckCondition(owner, squares){
    var isCheck = false;

    var king = _.find(squares, function(square){
        if(square.piece)
            return square.piece.id === owner + "x";
    });

    var kp = king.piece,
        r = king.coordinates.row,
        c = king.coordinates.column,
        rr, cc;

    var nextIndex = king.index;
    for(rr = r; rr > 0 ; rr--){
        nextIndex -= 8;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'r'
                    ||(rr === r && t === 'x')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(rr = r; rr < 7; rr++){
        nextIndex += 8;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'r'
                    ||(rr === r && t === 'x')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(cc = c; cc > 0; cc--){
        nextIndex -= 1;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'r'
                    ||(rr === r && t === 'x')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(cc = c; cc < 7; cc++){
        nextIndex += 1;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'r'
                    ||(rr === r && t === 'x')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(rr = r, cc = c; rr > 0 && cc > 0; rr--, cc--){
        nextIndex -= 9;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'b'
                    ||(rr === r && t === 'x')
                    ||(rr === r && t === 'p')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(rr = r, cc = c; rr > 0 && cc < 7; rr--, cc++){
        nextIndex -= 7;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'b'
                    ||(rr === r && t === 'x')
                    ||(rr === r && t === 'p')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(rr = r, cc = c; rr < 7 && cc > 0; rr++, cc--){
        nextIndex += 7;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'b'
                    ||(rr === r && t === 'x')
                    ||(rr === r && t === 'p')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    for(rr = r, cc = c; rr < 7 && cc < 7; rr++, cc++){
        nextIndex += 9;
        var p = squares[nextIndex].piece;
        if(p){
            if(isOpponent(kp, p)){
                var t = p.id.charAt(1);
                if(t === 'q' || t === 'b'
                    ||(rr === r && t === 'x')
                    ||(rr === r && t === 'p')
                )
                    isCheck = true;
            }
            break;
        }
    }
    nextIndex = king.index;
    if(c !== 0){
        _.each([nextIndex -17, nextIndex + 15], function(i){
            if(squares[i]) {
                var p = squares[i].piece;
                if (p && isOpponent(kp, p) && p.id.charAt(1) === 'k')
                    isCheck = true;
            }
        });
    }
    if(c > 1){
        _.each([nextIndex - 10, nextIndex + 6], function(i){
            if(squares[i]) {
                var p = squares[i].piece;
                if (p && isOpponent(kp, p) && p.id.charAt(1) === 'k')
                    isCheck = true;
            }
        });
    }
    if(c !== 7){
        _.each([nextIndex - 15, nextIndex + 17], function(i){
            if(squares[i]) {
                var p = squares[i].piece;
                if (p && isOpponent(kp, p) && p.id.charAt(1) === 'k')
                    isCheck = true;
            }
        });
    }
    if(c < 6){
        _.each([nextIndex - 6, nextIndex + 10], function(i){
            if(squares[i]) {
                var p = squares[i].piece;
                if (p && isOpponent(kp, p) && p.id.charAt(1) === 'k')
                    isCheck = true;
            }
        });
    }

    return isCheck;
}