(function(){
    var bc = [300.595,377.191]; // belly centroid
    var p = [135,395];
    var r1 = 'rotate(360,'+bc[0]+','+bc[1]+')';

    var col1 = '#212121',
        col2 = '#eee';

    var dur = 4000;

    var svg = d3.select('#svg-03');
    var bg = svg.selectAll('.p03-bg');
    var belly = svg.select('#p03-belly');
    var hand = svg.select('#p03-hand');

    var nodes = blendNodes(0,600,p[0],p[1],10);
    var links = generateChainLinks(nodes);
    var linkForce = d3.forceLink(links)
        .id(function(d){ return d.id })
        .distance(10)
        .strength(0.4);
    var simulation = d3.forceSimulation(nodes)
            .force('linkForce', linkForce)
            .velocityDecay(0.1)
            .on('tick', tick)
        ;


    var curve = hand.insert('path', ':first-child')
        .datum(simulation.nodes())
        .style("stroke", '#fff')
        .style("stroke-width", 30)
        .style('fill', 'rgba(0,0,0,0)')
        .style('stroke-linecap', 'round')
        ;



    var handin = hand.select('#hand-in').call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

    var bgp = bg.selectAll('path').attr('transform', 'scale(1)');

    var pp = nodes[nodes.length-1];
    var ref = [];
    var tp = [];    //offset
    var scaleBool = false;
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();


        tp[0] = d3.event.x - p[0];
        tp[1] = d3.event.y - p[1];

        ref[0] = d3.event.x;
        ref[1] = d3.event.y;

        svg.select('#p03-bg-07').selectAll('path').call(cycle);
    }

    function dragged(d) {

        pp.fx = d3.event.x - tp[0];
        pp.fy = d3.event.y - tp[1];

        handin.attr('transform', 'translate('+
            (d3.event.x - ref[0]) +','+
            (d3.event.y - ref[1]) +')');

    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);

        bg.selectAll('path').interrupt();
    }

    var c = 0;
    function cycle(d) {
        c++;
        d3.select(d)
            .transition().duration(dur).ease(d3.easeQuad)
            .attrTween("transform", function(){
                return d3.interpolateString( d3.select(this).attr('transform'), (c%2==0) ? 'scale(1)' : 'scale(1.2)' );
            } )
            .on('end', cycle);

    }



    function tick(){
        curve.attr('d', d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return d.x })
                .y(function(d) { return d.y })
        );
    }

    function generateChainLinks(nodes){
        var result = [];
        for(var i = nodes.length-1; i > 0; i--){
            var o = {};
            o.source = nodes[i].id;
            o.target = nodes[i-1].id;
            result.push(o);
        }
        return result;
    }

    function blendNodes(x1,y1,x2,y2,s){
        var result = [];
        var xm = (x2-x1) / s;
        var ym = (y2-y1) / s;
        for(var i = 0; i < s; i++){
            var o = {};
            o.x = xm * s + x1;
            o.y = ym * s + y1;
            o.id = i;
            result.push(o);
        }
        // lock starting node in place
        result[0].fx = x1;
        result[0].fy = y1;
        return result;
    }

})();