(function(){

    var svg = d3.select('#svg-04');
    var baby = svg.select('#p04-baby');
    var bg = svg.select('#p04-background').select('rect');


    var simulation = d3.forceSimulation(baby)
            .velocityDecay(0.1)
            .on('tick', function(){})
        ;

    baby.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

    ref=0;
    function dragstarted(d) {
        console.log('started');
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        ref = d3.event.y;
    }

    function dragged(d) {
        var y = d3.event.y;
        if(y<100)y=100;
        baby.attr('transform', 'translate(0,'+ (y- ref) +')');

        bg.attr('fill', d3.hsv(Math.random()*360,1,1));

    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        baby.transition().attr('transform', 'translate(0,0)');
    }

})();