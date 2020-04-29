//barchart = NobelBarchart()
//barchart.setup("#nobel-bar")
//barchart.update(nobelData.full)

let barchart, scatterplot
let scatterdata, bardata
let x, y, r, key

let updateWithRandomData = () => {
  randomData = bardata
    .filter(d => Math.random() > 0.4)
    .map(d => {
      return {key: d.key, value: d.value * Math.random()}
    })
  barchart.update(randomData)
  randomData = scatterdata
    .filter(d => Math.random() > 0.4)
    .map(d => {
      return {...d,
              x: d[x] * Math.random(),
              y: d[y] * Math.random(),
              r: d[r] * Math.random(),
              key: d[key]
             }
    })
  scatterplot.update(randomData)
}

let getDataByKeyValue = (data, key="Area", value="Valid_Votes") => {
  return data.map(d => {
    return {key: d[key], value: d[value]}
  })
}

let setupBarchart = (data) => {
  let barchart = Barchart()
  barchart.setup("#bar", {
    xLabel: "London Area", yLabel: "Valid votes cast",
    margin: {top:20, right:20, bottom:150, left:60}
  })
  bardata = getDataByKeyValue(data, "Area", "Valid_Votes")
  console.log("Mapped dataset", data)
  barchart.update(data)
}

let setupScatterplot = (data, _x="Median Age", _y="Pct_Leave", _r="% Unemployed", _key="Area") => {
  x = _x, y = _y, r = _r, key = _key;
  let scatterplot = Scatterplot()
  scatterplot.setup("#scatter", {
    xLabel: "Median age", yLabel: "% Voted for leave",
    margin: {top:20, right:20, bottom:60, left:60}
  })
  scatterdata = data.map(d => {
    return {x: d[x], y: d[y], r: d[r], key: d[key]}
  })
  scatterplot.update(scatterdata)
}

d3.json("london_brexit_data.json", _data => {
  // .then(_data => {
  data = _data
  setupBarchart(data)
  setupScatterplot(data)
  console.log(data)
})
