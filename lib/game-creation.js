Meteor.Game = {
    generateSquares: generateSquares
};

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
            isDark: (r % 2 != c % 2),
            piece: pieces[i],
            from: false,
            isValid: false,
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
    return {
        row: 8 - row,
        column: letters[column]
    }
}

function getCoordinatesGivenIndex(index) {
    return {
        column: index % 8,
        row: Math.floor(index / 8)
    };
}