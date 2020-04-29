console.log("Hello World!!")

d3.csv("brexit_full.csv")
  .then(data => {
    console.log(data)
  })
