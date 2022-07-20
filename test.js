export function createPie(side, radius, data, elementId){

    if(!data) return
    console.log(elementId)
    
    const elementX = document.querySelector("#node-"+elementId).getAttribute('cx') 
    const elementY = document.querySelector("#node-"+elementId).getAttribute("cy")
    console.log("Element X: "+elementX)
    
    const perimeter = 2*Math.PI*radius;
    const colours = ["pink", "yellow", "green", "grey", "purple"]
    // Convert data to percentages
    var sumData = 0
    var cumSumData = 0
    data.forEach((item)=>{
        sumData+=item
    })
    const percentages = []
    const strokeDashArrayLength = [] 
    data.forEach((item)=>{
        percentages.push(item/sumData) // Generate percentages from data
        strokeDashArrayLength.push(cumSumData+item) // Generate stroke-dasharray length from data
        cumSumData+=item
    })
    console.log(strokeDashArrayLength)
    
    var piezone = d3.select(".nodes")
    var svg = piezone
        // .insert("svg")
        // .attr("height", side)
        // .attr("width", side)
        // .attr("viewbox", "0 0 "+side+" "+side)

    data.forEach((item, index)=>{
        console.log("item: "+item+" with idex: "+index+" and colour: "+colours[index])
        svg.append("circle")
        .attr("r", radius/2)
        .attr("cx", side/2)
        .attr("cy", side/2)
        .attr("fill", "transparent")
        .attr("stroke", colours[colours.length - 1 - index])
        .attr("stroke-width", radius)        
        .attr("stroke-dasharray", (strokeDashArrayLength[(strokeDashArrayLength.length - 1 - index)]/100*perimeter/2)+" "+perimeter/2)
        .attr("transform", "rotate(-90) translate(-"+side+")")
        .on("mouseover", lightenPie)
        .on("mouseout", revertPie)
    })
}

function lightenPie(){
    d3.select(this)
        .style("opacity", 0.8)
}
function revertPie(){
    d3.select(this)
        .style("opacity", 1)
}



