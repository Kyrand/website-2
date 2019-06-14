/* global d3; */

let svg = d3.select("svg")
let height = 400, width = 400

let blueBoxes = () => {
  svg.selectAll(".box")
    .style("fill", "blue")
    .style("stroke", "black")
    .style("stroke-width", "3px")
}

let colorBoxes = () => {
  svg.select("#box1")
    .style("fill", "red")

  svg.select("#box2")
    .style("fill", "green")
}

let BGRStack = () => {
  d3.select("#box3")
    //.transition().duration(2000)
    .attr("x", 175)
    .attr("y", 125)

  d3.select("#box1")
    //.transition().duration(2000)
    .attr("x", 175)
    .attr("y", 75)
}

let alignBoxes = (selection=".box") => {
  d3.selectAll(selection)
    .transition().duration(2000)
    .attr("x", 350)
}

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

let xScale = d3.scaleBand()
let yScale = d3.scaleLinear()
let addAxesOrd = (padding=0.0) => {
  svg.selectAll([".x-axis", ".y-axis"]).remove()
  yAxisG = svg.append('g')
    .attr("class", "y-axis")

  xAxisG = svg.append('g')
    .attr("transform", "translate(0,400)")
    .attr("class", "x-axis")

  xScale.range([0, width])
    .domain(["red", "green", "blue"])
    .padding(padding)

  yScale.range([0, width])
    .domain(["red", "green", "blue"])
    .domain([0, width])

  xAxis = d3.axisBottom()
    .scale(xScale)

  yAxis = d3.axisLeft()
    .scale(yScale)

  xAxisG.call(xAxis)
  yAxisG.call(yAxis)

}

let drawGrid = () => {

  d3.selectAll(".x-axis .tick line")
    .attr("y2", -height)

  d3.selectAll(".y-axis .tick line")
    .attr("x2", width)
}

let dataObj = {"red": 250, "green": 100, "blue": 150}

let dataArray = [
  {color: "red", height: 250},
  {color: "green", height: 100},
  {color: "blue", height: 150},
]

let barWidth = 100

let makeBarsObj = () => {
  d3.select("#box1")
    .attr("x", 0 * barWidth).attr("y", height - dataObj.red)
    .attr("width", barWidth)
    .attr("height", dataObj.red)

  d3.select("#box2")
    .attr("x", 1 * barWidth).attr("y", height - dataObj.green)
    .attr("width", barWidth)
    .attr("height", dataObj.green)

  d3.select("#box3")
    .attr("x", 2 * barWidth).attr("y", height - dataObj.blue)
    .attr("width", barWidth)
    .attr("height", dataObj.blue)
}

let updateBars = () => {
  svg.selectAll(".box")
    .data(dataArray)
    .style("fill", d => d.color)
    .transition().duration(2000)
    .attr("x", (d, i) => i * barWidth)
    .attr("y", d => height - d.height)
    .attr("height", d => d.height)
    .attr("width", barWidth)
}

let smileyAppend = () => {
  // EYES
  svg.append("circle")
    .attr("cx", 115).attr("cy", 125)
    .attr("r", 40)
    .style("fill", "black")

  svg.append("circle")
    .attr("cx", 235).attr("cy", 125)
    .attr("r", 20)
    .style("fill", "black")
  // NOSE


  // SMILE
  svg.select("#box1")
    .transition().duration(2000)
    .attr("x", 100).attr("y", 200)
  svg.select("#box2")
    .transition().duration(2000)
    .attr("x", 150).attr("y", 250)
  svg.select("#box3")
    .transition().duration(2000)
    .attr("x", 200).attr("y", 200)

}

let makeBars = () => {
  svg.selectAll(".newBars")
    .data(dataArray).enter()
    .append("rect")
      .style("fill", d => d.color)
  // .enter()
      .attr("x", (d, i) => i * barWidth)
      .attr("y", d => height - d.height)
      .attr("height", d => d.height)
    .attr("width", barWidth)
}

let removeBoxes = () => {
  svg.selectAll(".box")
    .remove()
}

let drawScalePoints = () => {
  circleXs = [0, 100, 200, 400]
  svg.selectAll("circle")
    .data(circleXs).enter()
    .append("circle").style("fill", "red")
    .attr("cx", 0).attr("cy", 200)
    .attr("r", 10)
    .transition().duration(2000)
    .attr("cx", d => scale(d))
}

let updateScale = (x=200) => {
  scale.domain([0, x])

  xAxisG
    .transition().duration(2000)
    .call(xAxis)
}

let makeBarsOrd = () => {
  svg.selectAll(".box")
    .data(dataArray).enter()
    .append("rect")
    .style("fill", d => d.color)
  // .enter()
    .attr("x", (d) => xScale(d.color))
    .attr("y", d => height - d.height)
    .attr("height", d => d.height)
    .attr("width", xScale.bandwidth())
}

blueBoxes()
colorBoxes()
addAxes()
drawGrid()
BGRStack()
// //alignBoxes("#box1, #box2")
// makeBarsObj()
// updateBars()
//makeBars()
//smileyAppend()
//removeBoxes()
//updateScale(800);
//drawScalePoints()
//addAxesOrd(0.2)
//makeBarsOrd()
