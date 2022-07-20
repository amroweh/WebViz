var data = [2, 4, 8, 10];

export function createPieChart(radius, data, element){
    
    if(!data) return
    
    const width = radius * 2
    const height = radius * 2

    var pie_area = d3.select(element)
    // pie_area.append('svg')
    //     .attr('width', width)
    //     .attr('height', height)
    
    // var svg = pie_area.select('svg')
    var g = pie-area.append('g').attr('transform', 'translate('+width/2+','+height/2+')');
    
    var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    
    var pie = d3.pie(); // Generate pie
    var arc = d3.arc() // Generate Arcs
        .innerRadius(radius/3)
        .outerRadius(radius)
    
    //Generate groups
    var arcs = g.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class','arc')
    
    
    //Draw arc paths
    arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc);
}