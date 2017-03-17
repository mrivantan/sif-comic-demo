(function(){

    var p = [428,250];
    var r1 = 'rotate(-5,'+p[0]+','+p[1]+')';
    var r2 = 'rotate(5,'+p[0]+','+p[1]+')';
    var dur = 500;


    var svg = d3.select('#svg-02');
    var bg = svg.select('#p02-background');
    var txt = svg.select('#p02-text');
    var hd = svg.select('#p02-head');

    bg.attr('transform', 'translate(-600,0)');
    txt.attr('transform', 'translate(0,0)');

    hd.call(cycle)
        .on('mouseover',mouseover)
        .on('mouseleave',mouseleave);


    var c = 0;
    function cycle(d) {
        c++;
        hd.transition()
            .duration(dur)
            .ease(d3.easeQuad)
            .attrTween("transform", function(){
                return d3.interpolateString( (c%2==0)?r1:r2, (c%2==0)?r2:r1 );
            } )
            .on('end', cycle);
    }

    function mouseover(){
        bg.transition()
            .duration(1500)
            .ease(d3.easeExpIn)
            .attrTween("transform", function(){
                return d3.interpolateString( bg.attr('transform'), 'translate(0,0)' );
            } );

        txt.transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attrTween("transform", function(){
                return d3.interpolateString( txt.attr('transform'), 'translate(7,0)' );
            } );

    }

    function mouseleave(){

        bg.transition()
            .duration(1000)
            .ease(d3.easeExpOut)
            .attrTween("transform", function(){
                return d3.interpolateString( bg.attr('transform'), 'translate(-600,0)' );
            } );

        txt.transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attrTween("transform", function(){
                return d3.interpolateString( txt.attr('transform'), 'translate(0,0)' );
            } );

    }


})();