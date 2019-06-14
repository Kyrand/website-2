let svg = d3.select("svg")
let width = 400, height = 400

let scale = d3.scaleLinear()
let xAxisG, yAxisG, xAxis, yAxis
let addAxes = () => {
  yAxisG = svg.append('g')
      .attr("class", "y-axis")

  xAxisG = svg.append('g')
      .attr("transform", "translate(0,400)")
      .attr("class", "x-axis")

   scale.range([0, width])
      .domain([0, width])

  xAxis = d3.axisBottom()
      .scale(scale)

  yAxis = d3.axisLeft()
      .scale(scale)

  xAxisG.call(xAxis)
  yAxisG.call(yAxis)

}

let drawGrid = () => {

  d3.selectAll(".x-axis .tick line")
    .attr("y2", -height)

  d3.selectAll(".y-axis .tick line")
    .attr("x2", width)
}

let setup = () => {
  addAxes()
  drawGrid()
}

setup()

var pointsA = [{x: 150, y:150, r:10}, {x: 120, y: 120, r:20}, {x:180, y:160, r:10}]
var pointsB = [{x: 150, y:220, r:10}, {x: 200, y: 55, r:20}, {x:10, y:300, r:10}]
var pointsC = [{x: 75, y:20, r:30}, {x: 100, y: 95, r:10}]
pointsD = [{x: 115, y:120, r:40}, {x: 180, y: 195, r:5}, {x:120, y:250, r:60}, {x:140, y:50, r:30}, {x:220, y:100, r:55}, {x:60, y:50, r:5}]

 function updatePoints(points) {
     let circles = svg.selectAll('.demo-circle')
                      .data(points)

     circles.enter()
       .append('circle')
     .attr("class", "demo-circle")
       .style('fill', 'red')
       .attr("cx", 200).attr("cy", 200)
       .merge(circles)
       .transition().duration(2000)
       .attr('cx', d => d.x)
       .attr('cy', d => d.y)
       .attr('r', d => d.r)

     circles.exit()
       .transition().duration(2000)
       .style("opacity", 0)
       .remove()
   }

let happyFace = () => {
  svg.append("circle")
    .style("fill", "none")
    .style("stroke-width", "10px")
    .style("stroke", "black")
    .attr("cx", 200).attr("cy", 200)
    .attr("r", 150)

  svg.append("circle")
    .style("fill", "blue")
    .attr("cx", 125).attr("cy", 150)
    .attr("r", 15)

  svg.append("circle")
    .style("fill", "blue")
    .attr("cx", 275).attr("cy", 150)
    .attr("r", 15)

}

let happyPoints = () => {
  let start = {x: 200, y: 200}
  let radius = 75
  let numPoints = 10
  let points = d3.range(0, numPoints)
  let theta = Math.PI/(numPoints-1)
  let startTheta = 0
  points = points.map((d,i) => {
    return {x: start.x + Math.cos(i*theta) * radius, y: start.y + Math.sin(i*theta) * radius, r: 5}
  })
  console.log(points)
  return points
}

let sadPoints = [...happyPoints()]
sadPoints = sadPoints.map(d => {return {x: d.x, y: 500 -d.y , r: d.r}})
console.log(sadPoints)

happyFace()

//updatePoints(happyPoints)
updatePoints(sadPoints)
