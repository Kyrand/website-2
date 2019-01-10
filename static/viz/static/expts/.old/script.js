var cb;
// main javascript here:
d3.json('data/kk.json', function(error, data){

    var DEFAULT_BOARD_SIZE = 40;
    kcharts.ChessBoard = function() {
        var cols = 'abcdefgh', pieces, cb = new kcharts.BasicPlugin({
            class: board,
            size: DEFAULT_BOARD_SIZE
        }),
            game = new Chess();

        cb.longFen = function(fen) {
            var i, commas = ',,,,,,,,',
                lfen = fen.split('').map(function(c) {
                    if(c === '/'){return '';}
                    i = parseInt(c);
                    if(!isNaN(i)){
                        return commas.slice(0, i);
                    }
                    return c;
                });
            return lfen.join('');  
        };

        cb.drawPieces = function() {
            cb.svg.selectAll('.piece')
                .attr('transform', function(d) {
                    var pos = cb.posToCoords(d.pos);
                    return 'translate(' + pos.x + ',' + pos.y + ')';
                })
                .append('svg:image')
                .attr('xlink:href', function(d) {
                    return 'images/' + d.color + '-' + d.piece + '.svg';
                }) 
                .attr('class', 'piece')
                .attr('width', cb.size())
                .attr('height', cb.size())
            ;
        };

        cb.newBoard = function() {
            cb.svg.selectAll('.square rect').attr('width', cb.size()).attr('height', cb.size())
                .attr('x', function(d) {
                    return (d % 8) * cb.size();
                })
                .attr('y', function(d) {
                    return parseInt(d/8) * cb.size();
                })
                .attr('fill', function(d) {
                    if((d + parseInt(d/8))%2){return '#d08b48';}
                    return '#fece9e';
                })
                .attr('class', 'square')
            ;
        };
        
        cb.build = function() {
            cb.currentMoveNum = 0;
            cb.game = new Chess();
            cb.game.load_pgn(cb.data());
            cb.history = cb.game.history();
            cb.currentGame = new Chess();
            squares = 
                cb.gEnter.selectAll('.square')
                .data(d3.range(64)).enter(); 
            squares = squares.append('g').attr('class', 'square');
            squares.append('rect');
            cb.fen = cb.longFen(game.fen());
            cb.newBoard();
            // draw pieces
            // pieces = cb.gEnter.selectAll('.pieces')
            //     .data(pieces).enter();
            // cb.pieces = pieces.append('g').attr('class', 'piece');
            // cb.drawPieces();
        };

        cb.update = function() {
            var move = cb.history(cb.currentMove);
            cb.currentMoveNum += 1; 
            cb.squares.
            // cb.pieces.each(function(d, i) {
            //     var to, piece = this,
            //         moveTo = function(sqpos) {
            //             to = cb.posToCoords(sqpos);
            //             d3.select(piece).transition().duration(1000)
            //                 .attr('transform', 'translate(' + to.x + ',' + to.y + ')');
            //             d.pos = sqpos;
            //         };
                
            //     if(d.pos === move.from){ // is piece selected?
            //         moveTo(move.to);
            //     }
            //     else if(d.pos === move.to){ // we're taking selected?
            //         to = cb.posToCoords(move.to);
            //         d.pos = 'x9';
            //         d3.select(this).transition().duration(1000)
            //             .style('opacity', 0);
            //     }
            //     // castling arbitrariness
            //     if(move.san === 'O-O'){
            //         if(i === WKR && move.color === 'w'){moveTo('f1');}
            //         else if(i === BKR && move.color === 'b'){moveTo('f8');}
            //     }
            //     else if(move.san === 'O-O-O'){
            //         if(i === WQR && move.color === 'w'){moveTo('c1');}
            //         else if(i === BQR && move.color === 'b'){moveTo('c8');}
            //     }
            //     else if(move.san.slice(-3) === 'eps'){
            //     }
            // }); 
        };
        
        return cb;
    };

    cb = new kcharts.ChessBoard();
    d3.select('#board').datum(data[0]).call(cb);
});
