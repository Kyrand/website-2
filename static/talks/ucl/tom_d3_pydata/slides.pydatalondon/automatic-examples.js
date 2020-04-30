function evalCode(element) {
  element.classList.remove('error');

  if (element.classList.contains("html")) {
    Reveal.getCurrentSlide().querySelector('.demo').innerHTML = element.textContent;
    element.classList.add('running');
  } else {
    var code = element.textContent;
    console.log('EVAL', code);
    var geval = eval;
    try {
      eval(code);
      element.classList.add('running');
    } catch (e) {
      console.log('ERROR EVALING CODE', e);
      element.classList.add('error');
      toastr.error(e.message);
    }
  }

  setTimeout(function () {
    element.classList.remove('running');
  }, 500);
}

function toarray(obj) {
  var l = obj.length, i, out = [];
  for(i=0; i<l; i++) out[i] = obj[i];
  return out;
}

var nextId = 0;
function getDOMIdent(el) {
  if (!el.ident) {
    el.ident = nextId;
    nextId++;
  }
  return el.ident;
}


function displayDOM(rootDisplay, rootEl) {
  var initial = true;
  function update(display, el, depth) {
    // console.log('update', display, el, depth
    var children = toarray(el.childNodes).filter(function (e) { return e.tagName != null || e.textContent.trim()});

    // console.log(children);

    // console.log(children);

    var sel = d3.select(display)
        .selectAll('.node.depth-' + depth).data(children, getDOMIdent);

    // console.log(sel);
    // console.log('enter/exit', sel.enter(), sel.exit());

    var isText = function (el) {return el.tagName == null};

    if (initial) {
      sel.exit().remove();
    } else {
      sel.exit()
        .style('background', 'red')
        .transition().duration(1500).style('opacity', 0)
        .remove();
    }

    var enter = sel.enter()
        .append('div')
        .attr('class', function (el) { return (isText(el) ? 'text' : 'el') + ' node depth-' + depth});

    if (!initial) {
        enter.style('background-color', 'green').style('opacity', 1);
    }

    enter.transition().duration(1500).style('background-color', 'black')

    var open = enter.append('div').attr('class', 'open');
    open.append('span').attr('class', 'tagName').text(function (e) { return isText(e) ? e.textContent : e.tagName});
    open.append('span').attr('class', 'attrs');
    enter.append('div').attr('class', 'children');
    sel.select('.children').each(function (el) {
      // console.log('each', this, el);
      if (!isText(el)) {
        update(this, el, depth+1);
      }
    });

    var close = enter.append('div')
        .attr('class', function (e) { return (
          e.childNodes.length > 0 ? 'close' : 'selfClosing'
        )})
    close.append('span')
      .attr('class', 'tagName')
      .text(function (e) {return e.tagName});

    var attrs = sel.select('.attrs').selectAll('.attr').data(function (e) {return e.attributes || []}, function (a) {return a.name});
    attrs.exit().style('background-color', 'red').transition().style('opacity', 0).remove();
    attrs.enter().append('span').attr('class', 'attr').style('opacity', 1)
      .style('background', 'green');
    attrs.transition().style('background-color', 'black');

    function format(v) {
      console.log('(', v, ')', typeof v);
      console.log(/^-?\d+[.]\d+(e-?\d+)?$/.exec(v));
      if (/^-?\d+[.]\d+(e-?\d+)?$/.exec(v)) {
        return Number(v).toFixed(2);
      }
      return v;
    }

    attrs.text(function (a) { return a.name + '=' + format(a.value)})



    sel.order();
  }

  var observer = new MutationObserver(function(mutations) {
    update(rootDisplay, rootEl, 0);
  });

  update(rootDisplay, rootEl, 0);
  observer.observe(rootEl, { attributes: true, childList: true, characterData: true, subtree: true});

  initial = false;
  return function () {
    observer.disconnect();
  };
}

function executeAuto(el) {
  var ref = el.getAttribute('data-auto');
  if (ref) {
    el = Reveal.getCurrentSlide().querySelector(ref);
  }
  evalCode(el);
}

d3.selectAll('[contenteditable]').append('button')
  .attr('class', 'play');

document.body.addEventListener('click', function (event) {
  if (event.target.className === 'play') {
    evalCode(event.target.parentNode);
  } else if (event.target.className === 'resetSlide') {
    resetSlide();
  }
});



Reveal.addEventListener( 'fragmentshown', function( event ) {
  if (event.fragment.hasAttribute('data-auto')) {
    var el = event.fragment;
    window.executeCurrentExample = function () { executeAuto(el) };
  } else {
    window.executeCurrentExample = null;
  }
} );

var shutdownDisplayDOM;
function resetSlide() {
  window.executeCurrentExample = null;

  var currentSlide = Reveal.getCurrentSlide();
  var previousSlide = Reveal.getPreviousSlide();


  if (shutdownDisplayDOM) {
    shutdownDisplayDOM();
    shutdownDisplayDOM = null;
  }

  // Clear demo on previous slide (otherwise our selectors might select the
  // versions on those previous slides)
  if (previousSlide) {
    var demo = previousSlide.querySelector('.demo');
    if (demo) {
      demo.innerHTML = '';
    }
  }

  var demoContent = currentSlide.querySelector('script[type="text/demo"]');
  if (demoContent) {
    var demo = currentSlide.querySelector('.demo');
    var dom = currentSlide.querySelector('.dom');
    demo.innerHTML = demoContent.textContent;
    shutdownDisplayDOM = displayDOM(dom, demo, 0)
  }

  var initCode = currentSlide.querySelectorAll('[data-slideinit]');
  for (var i = 0; i < initCode.length; i++) {
    evalCode(initCode[i]);
  }


  // Execute any auto blocks that are already shown (we may be coming
  // *backwards* to this slide)
  var autoCode = currentSlide.querySelectorAll('[data-auto]')
  for (var i = 0; i < autoCode.length; i++) {
    var el = autoCode[i];
    if (el.classList.contains('visible')) {
      executeAuto(el);
    }
  }
}

Reveal.addEventListener( 'slidechanged', function( event ) {
  resetSlide();
});


// D3 Tour Transitions slide
(function () {
  var state = true;
  setInterval(function () {
    var slide = Reveal.getCurrentSlide();
    if (slide && slide.id === "tour-transitions") {
      state = !state;
      var sel = d3.select('#transitions-loop circle').transition().duration(1400);
      if (state) {
        sel.attr('r', 100).attr('cx', 100).attr('fill', 'blue');
      } else {
        sel.attr('r', 15).attr('cx', 585).attr('fill', 'red');
      }
    }
  }, 1500);
})();

// D3 Tour Layouts slide
(function () {
  // Code adapted from http://bl.ocks.org/mbostock/1021953

  var slide = document.querySelector('#tour-layouts');

  var width = 960,
      height = 500;

  // var fill = d3.scale.category10();
  var fill = d3.scaleOrdinal(d3.schemeCategory10);

  var nodes = [],
      foci = [{x: 150, y: 150}, {x: 350, y: 250}, {x: 700, y: 400}];

  var svg = d3.select("#force-directed-example").append("svg")
      .attr("class", 'stretch')
      .attr("width", width)
      .attr("height", height);

  // var force = d3.layout.force()
  //     .nodes(nodes)
  //     .links([])
  //     .gravity(0)
  //     .size([width, height])
  //     .on("tick", tick);

  var force = d3.forceSimulation()
      // .force("collide", d3.forceCollide(12))
      // .force("center", d3.forceCenter(width / 2, height / 2))
      .nodes(nodes)
      .on("tick", tick);

  var node = svg.selectAll("circle");

  function tick(e) {
    // console.log(e)
    // var k = .1 * e.alpha;
    var k = .1 * this.alpha;

    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      o.y += (foci[o.id].y - o.y) * k;
      o.x += (foci[o.id].x - o.x) * k;
    });

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }

  setInterval(function(){
    if (slide !== Reveal.getCurrentSlide()) {
      return
    }
    nodes.push({id: ~~(Math.random() * foci.length)});
    // force.start();

    node = node.data(nodes);

    node.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 8)
      .style("fill", function(d) { return fill(d.id); })
      .style("stroke", function(d) { return d3.rgb(fill(d.id)).darker(2); })
      .call(force.drag);
  }, 500);

  Reveal.addEventListener('slidechanged', function () {
    if (slide !== Reveal.getCurrentSlide()) {
      force.stop();
    }
  });
})();

(function (){
  // Adapted from https://bl.ocks.org/mbostock/ba63c55dd2dbc3ab0127
  var slide = document.querySelector('#tour-mapping');

  var width = 960,
      height = 500;

  var radius = height / 2 - 5,
      scale = radius,
      velocity = .02;

  var projection = d3.geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(scale)
      .clipAngle(90);

  var canvas = d3.select("#mapping-example").append("canvas")
      .attr("width", width)
      .attr("height", height);

  var context = canvas.node().getContext("2d");

  var path = d3.geoPath()
      .projection(projection)
      .context(context);

  d3.json("world-110m.json", function(error, world) {
    if (error) throw error;

    var land = topojson.feature(world, world.objects.land);

    d3.timer(function(elapsed) {
      if (slide !== Reveal.getCurrentSlide()) {
        return;
      }
      context.clearRect(0, 0, width, height);

      context.fillStyle="#eee";
      context.strokeStyle="#666";
      projection.rotate([velocity * elapsed, 0]);
      context.beginPath();
      path(land);
      context.fill();

      context.beginPath();
      context.arc(width / 2, height / 2, radius, 0, 2 * Math.PI, true);
      context.lineWidth = 2.5;
      context.stroke();
    });
  });
})();

// Scales example
(function () {

  var slide = document.querySelector('#tour-scales');

  var scales = [
    {name: 'd3.scaleLinear', scale: d3.scaleLinear()},
    {name: 'd3.scalePow(2)', scale: d3.scalePow().exponent(2)},
    {name: 'd3.scalePow(10)', scale: d3.scalePow().exponent(10)},
    {name: 'd3.scaleSqrt', scale: d3.scaleSqrt()},
  ];

  var container = d3.select('#scales-example');
  var sel = container.selectAll('g').data(scales);
  var enter = sel.enter().append('g');
  enter.attr('transform', function (d,i) { return 'translate(0, ' + (i*50 + 50) + ')'});
  enter.append('text').text(function (d) {return d.name}).attr('stroke', 'white').style({'font-size': 20});
  enter.append('circle').attr({r: 10, fill: 'red', cy: 0, cx: 0});

  scales.forEach( function (x) {
    x.scale.domain([0,1]).range([180,950]);
  });

  d3.timer(function(elapsed) {
    if (slide !== Reveal.getCurrentSlide()) {
      return;
    }

    var input = (elapsed/5000) % 1;

    sel.select('circle').attr('cx', function (d) {
      // console.log(d.scale(input*100));
      return d.scale(input);
    });
  });
})();
