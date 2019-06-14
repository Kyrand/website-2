let studentData = [
  {id: 1, class: "A", scores: [34, 22, 19]},
  {id: 2, class: "A", scores: [28, 22, 34]},
  {id: 3, class: "B", scores: [18, 12, 15]},
  {id: 4, class: "B", scores: [39, 42, 40]},
  {id: 5, class: "A", scores: [23, 22, 25,]},
  {id: 6, class: "A", scores: [33, 34, 29]},
  {id: 7, class: "B", scores: [16, 14, 15]},
  {id: 8, class: "A", scores: [37, 40, 42]},
  {id: 9, class: "C", scores: [34, 27, 26]},
  {id: 10, class: "C", scores: [36, 40, 44]},
  {id: 11, class: "A", scores: [30, 30, 34]},
]

console.log(studentData)

let scores = [22, 33, 11, 10, 3, 44, 55]

scores.sort((a, b) => {
  return a < b
})

console.log(scores)

let avScores = studentData.map(d => {return {id: d.id, av: d3.mean(d.scores)}})

console.log(avScores)

#  - av. for a group
avScores = studentData.map(d => {return {id: d.id, av: d3.mean(d.scores)}})
//console.log("Average scores", avScores)


classA = studentData.filter(d => d.class === "A")
//console.log("Class A", classA)

scores = [45, 33, 22, 31, 27]

scores.sort()
scores.reverse()
//console.log(scores)
total_av = d3.mean(studentData
                   .map(d => d3.mean(d.scores))
                  )

console.log(total_av)
// CHALLENGE - get average value for class 'C', bonus points if you create a function that takes a class letter and returns an average, e.g. averageClassScore('A')
console.log(studentData.map(d => d3.mean(d.scores)))
// CHALLENGE - get ids of those students with average scores higher than 39 and present in descending order
total_scores = scores.reduce((acc, curr) => {
  return acc + curr;
}, 0)

// challenge -> top 3 in desc. order
