/* global d3 */
window.Barchart = function() {
  // Some generally accessible variables
  let transitionDuration = 2000
  let api = {}
  let svg
  let width, height
  let xScale, yScale
  let xAxis, yAxis
  let options
  
  api.setup = function(rootEl="#bar", _options={xLabel: "Area", yLabel: "Votes"}) {
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
    xScale = d3.scaleBand()
          .range([0, width])
          .padding(0.1)

    yScale = d3.scaleLinear()
          .range([height, 0])
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
      return d.value > 0
    })
   // .sort((a, b) => {
   //      return b.value - a.value
   //  })

    xScale.domain( data.map(function(d) { return d.key }) )
    yScale.domain([0, d3.max(data, function(d) { return +d.value })])

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

    let bars = svg.selectAll(".bar")
      //.data(data)
          .data(data, function(d) {
            return d.key
          })

    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .merge(bars)
      .transition().duration(transitionDuration)
      .attr("x", function(d) { return xScale(d.key) })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) { return yScale(d.value) })
      .attr("height", function(d) { return height - yScale(d.value) })

    bars.exit().remove()
  }

  return api
}
