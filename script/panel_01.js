(function(){
    var p = [317,584.2];
    var r1 = 'rotate(30,'+p[0]+','+p[1]+')';
    var r2 = 'rotate(45,'+p[0]+','+p[1]+')';
    var r3 = 'rotate(90,'+p[0]+','+p[1]+')';
    var dur = 4000;

    var svg = d3.select('#svg-01');
    var card = svg.select('#p01-card');
    card.call(cycle)
        .on('click', click);




    var c = 0;
    function cycle(d) {
        c++;
        card.transition()
            .duration(dur)
            .ease(d3.easeSin)
            .attrTween("transform", function(){
                return d3.interpolateString( (c%2==0)?r1:r2, (c%2==0)?r2:r1 );
            } )
            .on('end', cycle);
    }

    function click(){

        var r0 = card.attr('transform');

        card
            .interrupt()
            .transition()
            .duration(2000)
            .ease(d3.easeBounce)
            .attrTween("transform", function(){
                return d3.interpolateString( r0, r3 );
            } )
            .on('end', cycle)
            ;
    }

})();