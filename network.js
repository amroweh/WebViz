var data = {
  Nodes: [
    { id: 0, name: "Ali", money: 5000, children: null },
    { id: 1, name: "John", money: 30000, children: null },
    { id: 2, name: "Deep", money: 50000 , children: null},
    { id: 3, name: "Group", money: 10000 , children: [
      { id: 4, name: "Child1", money: 500 , children: null},
      { id: 5, name: "Child2", money: 1000 , children: null},
      { id: 6, name: "Child3", money: 300 , children: null}
    ]}],
  Links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 0, target: 2 },
    { source: 0, target: 3 }
  ],
};

function createNetworkGraph(width, height, id, data) {
  
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // This simulation prepares the forces required to maintain the nodes in the graph
  var simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    )
    .force(
      "charge",
      d3.forceManyBody().strength(-1900).theta(0.5).distanceMax(1500)
    )
    .force(
      "collision",
      d3.forceCollide().radius((d) => d.radius)
    )
    .force(
      "center",
      d3.forceCenter(
        document.querySelector(id).clientWidth / 2,
        document.querySelector(id).clientHeight / 2
      )
    );

  // Links
  var link = svg
    .append("g")
    .selectAll("line")
    .data(data.Links)
    .enter()
    .append("line");

  link.style("stroke", "#aaa");

  // Nodes
  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.Nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => (d.money > 10000 ? 45 : 35)) // Adjusts node radius based on money of the person
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mouseover", enlargeNode)
    .on("mouseout", revertNode)
    ;
        
  node
    .style("fill", "#cccccc")
    .style("fill-opacity", "0.9")
    .style("stroke", "#424242")
    .style("stroke-width", "1px")
    

  // Labels
  var label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data.Nodes)
    .enter()
    .append("text")
    .text((d) => d.name)
    .attr("class", "label");

  label.style("text-anchor", "middle").style("font-size", "10px");

  // Ticked function adjusts graph layout by specifying coordinates of graph elements
  // this is the function that is called at the beginning as the graph adjusts its elements
  // It is NOT the function that updates the coordinates when we drag nodes
  function ticked() {
    console.log("ticked");
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x + 5;
      })
      .attr("cy", function (d) {
        return d.y - 3;
      });

    label
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      });
  }

  simulation.nodes(data.Nodes)
    .on("tick", ticked);

  simulation.force("link").links(data.Links);

  // Drag functions: these are the functions that will be called as we click on a node
  // and attempt to drag them
  function dragstarted(e,d) {
    //your alpha hit 0 it stops! make it run again
    simulation.alphaTarget(0.3).restart();
    d.fx = e.x;
    d.fy = e.y;
  }
  function dragged(e,d) {
    d.fx = e.x;
    d.fy = e.y;
  }
  function dragended(e,d) {
    // alpha min is 0, head there
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // Helper function for node enlargement, Allows to get initial radius and return it to enlarge and revert
  // functions. On the first attempt, the radius and id for the hovered node is taken and saved in the zoomed
  // Nodes array. On later attempts for each node, the value of the radius is extracted from this array
  const zoomedNodes = []  
  function getInitialRadius(nodeID, radius){
    // Look for node in list
    nodeInList = zoomedNodes.find(x => x.id === nodeID)
    if(!nodeInList){ // If not found
      let nodeInfo = {"id": nodeID, "initial_Radius": radius}
      zoomedNodes.push(nodeInfo)
      return radius
    }
    else return nodeInList.initial_Radius
  }

  // Function to zoom in on Nodes
  function enlargeNode(){
    const radius = d3.select(this).attr('r')
    console.log("Enlarged Radius = "+radius)    
    d3.select(this).transition()
        .duration(300)
        .attr("r", (d)=>{
          return getInitialRadius(d.id, radius)*2;
        });
  }
  function revertNode(){
    const radius = d3.select(this).attr('r')
    console.log("Normal Radius = "+radius)    
    d3.select(this).transition()
        .duration(150)
        .attr("r", (d) => {
          return getInitialRadius(d.id, radius)
        });
  }
}

createNetworkGraph(960, 600, "#network-graph", data);
