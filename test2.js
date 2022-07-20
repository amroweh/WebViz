//Params
const params = {
    "radius": 50,
    "ringStrokeWidth": 10,
    "piegap": 15        
}
export function getPie(element, data){    
    drawRing(element, data.id, params)
    drawPie(element, data, params)
}

function drawRing(element, id, params){
    element
        .insert('circle')
        .attr('id','ring'+id)
        .attr('r', params.radius)
        .attr('fill', 'white')
        .attr('stroke', 'red')
        .attr('stroke-width', params.ringStrokeWidth)
}

function drawPie(element, data, params){
    
    console.log(data)
    if(!data.children) return
    else {
        const radius = params.radius*(1 - params.piegap/100)
        const perimeter = 2*Math.PI*radius
        const colours = ["pink", "yellow", "green", "grey", "purple"]
        // Convert data to percentages
        var sumData = 0
        var cumPercentage = 0
        data.children.forEach((item)=>{
            sumData+=item.money
            console.log("Money: "+item.money)
        })
        const percentages = []
        const percentagesCum = []
        data.children.forEach((item)=>{
            percentages.push(item.money/sumData) // Generate percentages from data            
        })
        percentages.forEach((d,i)=>{
            percentagesCum.push(percentages[i]+cumPercentage)
            cumPercentage+=d
        })
        
        
        data.children.forEach((item, index)=>{
            element.insert("circle")
                .attr('id','pie'+item.id)
                .attr("r", radius/2)
                .attr("fill", "transparent")
                .attr("stroke", colours[colours.length - 1 - index])
                .attr("stroke-width", radius)                
                .attr("stroke-dasharray", (percentagesCum[percentagesCum.length - 1 - index]*perimeter/2)+" "+perimeter/2)
                //.attr("transform", "rotate(-90) translate(-"+document.querySelector("svg").getAttribute("width")+")")
                .on("mouseover", lightenPie)
                .on("mouseout", revertPie)
        })
    }
}

function lightenPie(){
    d3.select(this)
        .style("opacity", 0.8)
        .style("cursor", "pointer")
}
function revertPie(){
    d3.select(this)
        .style("opacity", 1)
}

export function zoomNode(e,d){    
    
    
    d3.select(this)
        .select("circle")
        .transition()
        .duration(300)
        .attr("r", params.radius*2)    

    if(d.children){
        const innerRadius = params.radius*(1 - params.piegap/100)
        d3.select(this)
            .selectAll("circle")
            .transition()
            .duration(300)
            .attr("r", function(){
                if(d3.select(this).attr("id").includes("ring")){
                    console.log("Ring here")
                    return d3.select(this).attr("r")*2
                }
                else return innerRadius*2
            })
            .attr("stroke-width", innerRadius*2)      
            .attr("stroke-dasharray", function(d){
                console.log(d.children)
                // Convert data to percentages
                // var sumData = 0
                // var cumPercentage = 0
                // d.children.forEach((item)=>{
                //     sumData+=item.money
                //     console.log("Money: "+item.money)
                // })
                // const percentages = []
                // const percentagesCum = []
                // d.children.forEach((item)=>{
                //     percentages.push(item.money/sumData) // Generate percentages from data            
                // })
                // percentages.forEach((d,i)=>{
                //     percentagesCum.push(percentages[i]+cumPercentage)
                //     cumPercentage+=d
                // })
                // const newDashArray = (percentagesCum[percentagesCum.length - 1 - index]*perimeter/2)+" "+perimeter/2
                return d3.select(this).attr("stroke-dasharray")*2
            })      
    }   
    
}