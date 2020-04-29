/* global d3 */
let MAX_RADIUS = 20

window.Scatterplot = function() {
  // Some generally accessible variables
  let transitionDuration = 2000
  let api = {}
  let svg
  let width, height
  let xScale, yScale, rScale
  let xAxis, yAxis
  let options

  api.setup = function(rootEl="#scatter", _options={xLabel: "Area", yLabel: "Votes"}) {
    // All the barchart skeleton not driven by data:
    let chartHolder = d3.select(rootEl)
    // Let's make a little change to confirm we've arrived here
    chartHolder.style("background", "#eee")
    // DIMENSIONS
    let margin = {top:20, right:20, bottom:35, left:40}
    options = {margin, ..._options}
    margin = options.margin
    let boundingRect = chartHolder.node().getBoundingClientRect()
    width = boundingRect.width - margin.left - margin.right
    height = boundingRect.height - margin.top - margin.bottom
    // SCALES
    // xScale = d3.scaleBand()
    //       .range([0, width])
    //       .padding(0.1)

    xScale = d3.scaleLinear()
      .range([0, width])
      // .padding(0.1)

    yScale = d3.scaleLinear()
          .range([height, 0])

    rScale = d3.scaleLinear()
      .range([0, MAX_RADIUS])
    // AXES
    xAxis = d3.axisBottom()
          .scale(xScale)

    yAxis = d3.axisLeft()
          .scale(yScale)
          .ticks(10)
          .tickFormat(function(d) {
            // if(someUserDrivenFlag){
            //   return d.toExponential()
            // }
            return d
          })
    // CREATE MAIN CHARTHOLDING SVG TAG
    svg = chartHolder.append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // ADD AXES GROUPS
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "translate(" + width/2 + "," + (margin.bottom-10) + ")")
      .text(options.xLabel)

    svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("id", "y-axis-label")
      .attr("class", "axis-label")
      .attr("transform", "translate(" + (-margin.left) +  "," + height/2 + "),rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text(options.yLabel)
  }

  api.update = function(data) {
    data = data.filter(function(d) {
      return d.x > 0 && d.y > 0 && d.r > 0
    })
   // .sort((a, b) => {
   //      return b.value - a.value
   //  })

    xScale.domain( d3.extent(data.map(function(d) { return d.x })) )
    yScale.domain( d3.extent(data.map(function(d) { return d.y })) )
    rScale.domain( d3.extent(data.map(function(d) { return d.r })) )
    // yScale.domain([0, d3.max(data, function(d) { return +d.value })])

    svg.select(".x.axis")
      .transition().duration(transitionDuration)
      .call(xAxis)
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)")

    svg.select(".y.axis")
      .transition().duration(transitionDuration)
      .call(yAxis)

    let points = svg.selectAll(".point")
      //.data(data)
          .data(data, function(d) {
            return d.key
          })

    let newPoints = points.enter().append("circle")
      .attr("class", "point")
      .attr("x", 0).attr("y", 0)
    newPoints
      .append("title")
      .text(d => d.key)
    newPoints
      .merge(points)
      .transition().duration(transitionDuration)
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", d => rScale(d.r))

    points.exit().remove()
  }

  return api
}
