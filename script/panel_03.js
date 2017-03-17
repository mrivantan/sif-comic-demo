(function(){
    var bc = [300.595,377.191]; // belly centroid
    var p = [135,395];


    var svg = d3.select('#svg-03');
    var bgEven = svg.selectAll('.p03-bg-even').selectAll('path');
    var bgOdd = svg.selectAll('.p03-bg-odd').selectAll('path');
    var belly = svg.select('#p03-belly');
    var handGroup = svg.select('#p03-hand');

    // SCRIBBLE ARM: creating chain link-----------------
    var nodes = blendNodes(0,600,p[0],p[1],10);
    var links = generateChainLinks(nodes);
    var linkForce = d3.forceLink(links)
        .id(function(d){ return d.id })
        .distance(10)
        .strength(0.4);
    var simulation = d3.forceSimulation(nodes)
            .force('linkForce', linkForce)
            .velocityDecay(0.1)
            .on('tick', tick);

    var curve = handGroup.insert('path', ':first-child')
        .datum(simulation.nodes())
        .style("stroke", '#fff')
        .style("stroke-width", 30)
        .style('fill', 'rgba(0,0,0,0)')
        .style('stroke-linecap', 'round');



    var handGraphic = handGroup.select('#hand-in').call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );


    var lastHandNode = nodes[nodes.length-1];
    var handOriginPoint = {};
    var nodePositionOffset = [];    //offset
    lastHandNode.fx = p[0]; lastHandNode.fy = p[1];

    var cole1 = 'rgb(76, 187, 236)',
        cole2 = 'rgb(210, 10, 17)',
        colo1 = 'rgb(226, 0, 126)',
        colo2 = 'rgb(255, 210, 0)';
    var dur = 2000;

    bgEven.attr('fill', cole1);
    bgOdd.attr('fill', colo1);
    cycleColor(bgEven, cole1,cole2);
    cycleColor(bgOdd, colo1,colo2);
    function cycleColor(selection, c1, c2){
        var cFill = selection.attr('fill');
        selection.transition()
            .duration(dur)
            .ease(d3.easeLinear)
            .attr('fill', function(){
                return  (cFill == c1) ? c2 : c1 ;
            } )
            .on('end', function(){ cycleColor(selection,c1,c2)} );
    }


    
    // EVENT managers-----------------
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();

        var currentTranslate = getTranslation(handGraphic.attr('transform'));
        console.log(currentTranslate);

        nodePositionOffset[0] = d3.event.x - p[0] - currentTranslate[0];
        nodePositionOffset[1] = d3.event.y - p[1] - currentTranslate[1];

        handOriginPoint.x = d3.event.x - currentTranslate[0];
        handOriginPoint.y = d3.event.y - currentTranslate[1];
    }

    var cr = 0;
    belly.attr('transform', 'rotate('+cr+','+bc[0]+','+bc[1]+')');
    function dragged(d) {

        lastHandNode.fx = d3.event.x - nodePositionOffset[0];
        lastHandNode.fy = d3.event.y - nodePositionOffset[1];

        handGraphic.attr('transform', 'translate('+
            (d3.event.x - handOriginPoint.x) +','+
            (d3.event.y - handOriginPoint.y) +')');

        belly.attr('transform', 'rotate('+(cr++)+','+bc[0]+','+bc[1]+')');
        if(cr>360)cr=0;

    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);


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


    function getTranslation(transform) {
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttributeNS(null, "transform", transform);
        var matrix = g.transform.baseVal.consolidate().matrix;
        return [matrix.e, matrix.f];
    }

})();