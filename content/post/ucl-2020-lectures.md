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

## Task 1

Objectives:

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
