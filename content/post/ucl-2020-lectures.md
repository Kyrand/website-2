---
title: "Ucl 2020 Lectures"
description: "Lecture notes for the UCL 2020 dataviz module"
slug: ""
image: ""
keywords: ""
categories:
    - "Ucl 2020 Lectures"
    - ""
date: 2020-05-27T12:16:32+01:00
draft: false
---

## Intro

This series of lectures aims to build foundational skills in modern programmatic data vizualization. There are three main parts:

- Exploratory dataviz with Python notebooks and chart libraries like Matplotlib, Seaborn and Plotly.
- Moving the results of those explorations onto the web with Plotly, a powerful dataviz tool.
- Crafting web-based dataviz with D3 and JavaScript. D3 being by a big margin the largest and most popular dataviz library for the web.

Note that D3 is best thought of as a collection of modules or tools for such things as selecting and manipulating web-page elements (usually scalable vector graphics (SVG)), doing the mathematical book-keeping necessary for dataviz work (e.g. scales) and geographic mapping (a huge range of map forms available). We'll cover some of the key ones but a short course can only scratch the surface.

Although many of you won't end up programming dataviz for the web, this course should give you enough knowledge to know how it's done and to interact with and direct those doing it.

Some observations:

- Proprietary tools like Tableau and Power-BI are increasingly  sophisticated and would require a course in their own right.
- I think it's better to understand the ecosystem from which they come and the foundations on which they rest.
- A first class general purpose programming language like Python, allied to Pandas, notebooks and inbuilt charting represents a very powerful expressive context for exploratory dataviz (programmers almost always get frustrated with the limitations of GUI driven software like Tableau, and with good reason).
- Both programming and dataviz are craft skills, learned in the doing. The best way to learn is to find a project that is meaningful to you and try and scratch that itch.

I'm treating these lectures as a continuous block of time with tasks to be done. Online learning seems to be more intense and tiring than its real-world counterpart so we'll have regular breaks to recover and take stock.

## Submission of projects
Submission of projects as Jupyter notebooks and/or codepen (or other sandbox) 'pens' is encouraged but not mandatory.

The work will be assessed on all programmatic aspects of the dataviz process, which include cleaning your data. The dirty truth of dataviz is that most datasets are full of errors and cleaning them a vital part of the process of dataviz. Pandas and Jupyter notebooks are a great way to do this (see Chapter 9 of my book for an example of the process).

All of these will be assessed:

- Cleaning datasets.
- Exploring with Jupyter and chart libraries such as Matplotlib and Seaborn.
- Static and Dynamic charts.
- JavaScript charts/maps produced by Plotly, D3 etc.
- ancillary/supplemental datasets fine, anything used in final visualization

If you have any queries just send me an email.

## Last lecture
There will probably be some free time in the last lecture and I'd like to give you an opportunity to choose a focus or two. Here are some options:

- Modern JS (node-based, modular imports, much improved syntax)
- D3 in more depth
- Demo of more varied Matplotlib chart in exploratory dataviz
- Discussion of some general points about modern web dataviz
- Some issues thrown up by your projects

Feel free to vote by zoom message, send me an email, or open a group discussion on Moodle.

## Tasks 1

### Objectives:

- craft a raw dataset into an insightful chart using Pandas and Matplotlib.
- convert this chart to an embedded web chart using Python's Plotly library.

We aim to recreate one of the classic FT Covid-19 charts using Pandas and Matplotlib. We'll then take that as a basis for a Plotly chart and show how that can be embedded in a web-page as an interactive JavaScripted chart.

{{< figure src="/img/post/burns-ft-covid.jpg" title="FT Covid-19 chart" height="400" class="center-figure">}}

attribution: the original chart produced by John Burns Murdoch et. al. at the Financial times. Note that James Burns Murdoch uses D3 to produce all forms of his charts, print and web-based.

First we'll build the chart using Matplotlib and Panda's built in (Matplotlib based) plotting methods:

{{< figure src="/img/post/covid-matplotlib.png" title="FT Covid-19 Matplotlib chart" height="400" class="center-figure">}}

We'll then take that as a basis for an interactive Plotly chart that can be embedded in a standard web-page:

{{< figure src="/img/post/covid-plotly.png" title="FT Covid-19 Plotly chart" height="400" class="center-figure">}}

### Resources

- Burn-Murdoch criticism of John Hopkins https://twitter.com/jburnmurdoch/status/1263062077213749250
- Matplotlib line reference: https://matplotlib.org/gallery/lines_bars_and_markers/line_styles_reference.html

## Tasks 2

### Objectives:

- review the Covid-19 Jupyter notebook
- look at Plotly and Mapbox maps
- create a browser-based presentation using HTML, the Covid chart, maps and CSS flex-box
- embed static image from Jupyter -> Dropbox -> Codepen

We'll aim to produce a rough chart-based web presentation using a couple of Covid-19 Plotly charts, learning basic web-dev practice as we go along:


{{< figure src="/img/post/covid-plotly-web.png" title="FT Covid-19 Plotly chart and map" height="400" class="center-figure">}}

### Resources

- [Plotly Scatter Plots with Mapbox](https://plotly.com/python/scattermapbox/)
- [Mapbox access tokens](https://docs.mapbox.com/help/glossary/access-token/)
- [Flexboxes](https://www.w3schools.com/csS/css3_flexbox.asp)
- [CSS cheatsheet](https://adam-marsden.co.uk/css-cheat-sheet)
- [CSS Color Hex Codes](https://www.color-hex.com/)

## Tasks 3

### Objectives:

- review the Plotly chart-based web presentation.
- review flexboxes
- intro to SVG with face challenge:
- intro to D3 with D3 challenges

### Resources

- [Plotly charts](https://plotly.com/python/)
- [Kaggle Datasets](https://www.kaggle.com/datasets?fileType=csv)
- [SVG Visual Cheatsheet](http://www.cheat-sheets.org/own/svg/index.xhtml)
- [Codepen UCL D3 Demo](https://codepen.io/kyrand/project/editor/ZMbqEL)
- [UCL Codepen Collection](https://codepen.io/collection/XGyvyO)
- [Codepen Projects](https://codepen.io/pro/projects/)
- [D3 enter and exit patterns](https://www.d3indepth.com/enterexit/)
- [Mike Bostock's Blocks](https://bl.ocks.org/mbostock)

## Tasks 4

- D3 recap - mastering the select functor
- moving to Codepen project and out of Codepen sandbox
- Getting and manipulating data in JS - the powerful functional methods, map, filter and reduce..
- Using Plotly's JavaScript library with JavaScript

### Codepens:
[Selecting with D3](https://codepen.io/kyrand/pen/RwrwqJm)
[D3 Dancing Boxes - start](https://codepen.io/kyrand/pen/WBVZgz?editors=1111)
[Building Covid-19 Plotly presentation](https://codepen.io/kyrand/pen/eYJOJMq)
[Data manipulation with JavaScript's functional methods, plotting the results with Plotly](https://codepen.io/kyrand/pen/ZNgrOo)

### Resources
- [Plotly JavaScript docs](https://plotly.com/javascript/)

## Tasks 5

### Objectives
- Recap JS data manipulation
- Loading data into a JS app
- Using that data to make a chart, after filtering
- enhance our Covid-19 web presentation:
- [Covid-19 dataviz before](https://codepen.io/kyrand/pen/eYJOJMq?editors=1010)
- [Covid-19 dataviz after](https://codepen.io/gordongilson/project/editor/DNgOev)
-- !NOTE! - remove specific sizing..
-- remove or resize margins!
- deployting to surge.sh (see http://ucl-covid-19-dataviz.surge.sh/)

- Questions about web dataviz, projects etc.

###

[Python's geopy library](https://codepen.io/kyrand/pen/eYJOJMq?editors=1010)
[Free static web publishing with Surge](https://surge.sh/)
[Glitch - build full web apps for free](Uhttps://glitch.com/)
[first-of-type CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:first-of-type)
[Use of !important in CSS](https://www.lifewire.com/what-does-important-mean-in-css-3466876)
[Plotly barcharts with JS](https://plotly.com/javascript/bar-charts/)
