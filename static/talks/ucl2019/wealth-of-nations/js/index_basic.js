/* global d3 */

// function x(d) { return d.income }
// function y(d) { return d.lifeExpectancy }
// function radius(d) { return d.population }
// function color(d) { return d.region }
// function key(d) { return d.name }
let x = d => d.income
let y = d => d.lifeExpectancy
let radius = d => d.population
let color = d => d.region
let key = d => d.name

let margin = {top: 20., right: 20, bottom: 20, left: 40},
    width = 960 - margin.right,
    height = 500 - margin.top - margin.bottom

// Now define the scales we will need
let xScale = d3.scaleLog()
		.domain([300, 1e5])
		.range([0, width])

let yScale = d3.scaleLinear()
		.domain([10, 85])
		.range([height, 0])

let radiusScale = d3.scaleSqrt()
		.domain([0, 5e8])
		.range([0, 40])

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)

// we now define the x and y axes
let xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(12, d3.format(",d"))

let yAxis = d3.axisLeft()
		.scale(yScale)

// Create the SVG container and set the origin.
let svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// ADD THE AXES (D3 GENERATED)
// Add the x-axis to our root SVG, using a group
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)

// Add the y-axis to its group
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)

// ADD THE AXES LABELS
// Add an x-axis label.
svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("income per capita, inflation-adjusted (dollars)")

// Add a y-axis label.
svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("life expectancy (years)")

// Add the BIG YEAR LABEL - this will be updated both automatically and manually
let yearLabel = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(1800)

let dot, position, order
let data = {}
let displayYear
// Load the data.
d3.json("https://bost.ocks.org/mike/nations/nations.json")
  .then(nations => {
    console.log(nations)

    // A D3 bisector (using modules)
   // https://github.com/d3/d3-array#bisector

    let bisect = d3.bisector(function(d) { return d[0] })

    d3.range(1800, 2010).forEach(d => {
      data[d] = interpolateData(d)
    })

    // Positions the dots based on data.
    position = (dot) => {
      dot.attr("cx", d => xScale(x(d)) )
        .attr("cy", d => yScale(y(d)) )
        .attr("r",  d => radiusScale(radius(d)) )
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    order = (a, b) => {
      return radius(b) - radius(a)
    }

    // Add a dot per nation. Initialize the data at 1800, and set the colors.
    dot = svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        //.data(interpolateData(1800))
        .data(data[1800])
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", d => colorScale(color(d)) )
        .call(position)
        .sort(order)

    // Updates the display to show the specified year.
    displayYear = (year) => {
      //dot.data(interpolateData(year), key).call(position).sort(order)
      dot.data(data[year]).call(position).sort(order)
      yearLabel.text(Math.round(year))
    }

    // Start a transition that interpolates the data based on year.
    // svg.transition()
    //   .duration(30000)
    //   .ease(d3.easeLinear)
    //   .tween("year", tweenYear)
      // .on("end", enableInteraction);

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
      let year = d3.interpolateNumber(1800, 2009)
      return function(t) { displayYear(year(t)) }
    }

    // Interpolates the dataset for the given (fractional) year.
    function interpolateData(year) {
      return nations.map(function(d) {
        return {
          name: d.name,
          region: d.region,
          income: interpolateValues(d.income, year),
          population: interpolateValues(d.population, year),
          lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
        }
      })
    }

    // Finds (and possibly interpolates) the value for the specified year.
    function interpolateValues(values, year) {
      var i = bisect.left(values, year, 0, values.length - 1),
          a = values[i]
      if (i > 0) {
        var b = values[i - 1],
            t = (year - a[0]) / (b[0] - a[0])
        return a[1] * (1 - t) + b[1] * t
      }
      return a[1]
    }

    console.log(interpolateData(1820))

  })
