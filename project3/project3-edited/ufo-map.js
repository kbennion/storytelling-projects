(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select("#map")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "smaller_ufos.csv")
    .await(ready)

  var projection = d3.geoAlbersUsa()
    .translate([ width / 2, height / 2 ])
    .scale(850)

  var path = d3.geoPath()
    .projection(projection)

  function ready (error, data, ufos) {

    var states = topojson.feature(data, data.objects.states).features;

    // .attr("d", line)
    svg.selectAll(".state")
      .data(states)
      .enter().append("path")
      .attr("class", "state")
      .attr("d", path)
      .attr("fill", "#333333")
      .attr("stroke", "#e3e3e3")
      .attr("stroke-width", 0.5)

    d3.select("#a-button").on('click', function() {
  console.log("Test")
});

    svg.selectAll(".ufo-circle")
      .data(ufos)
      .enter().append("circle")
      .attr("class", "ufo-circle")
      .attr("r", 5)
      .attr("fill", "yellow")
      .attr("opacity", 0.7)
      .attr("cx", function(d) {
        var coords = projection([d.Longitude, d.Latitude])
        if (coords)
        {return coords[0]
        }
      })
      .attr("cy", function(d) {
        var coords = projection([d.Longitude, d.Latitude])
         if (coords)
        {return coords[1]
        }
      })

var step = 1

setTimeout(function() {

step++;

currentDatapoints = ufos.filter(function(d) { return d.Step === step });

var circles = svg.selectAll(".ufo-circle")
.data(currentDatapoints);

circles.exit().remove()
circles.enter().append("circle").merge(circles)
      .attr("r", 5)
      .attr("fill", "yellow")
      .attr("opacity", 0.7)
      .attr("cx", function(d) {
        var coords = projection([d.Longitude, d.Latitude])
        if (coords)
        {return coords[0]
        }
      })
      .attr("cy", function(d) {
        var coords = projection([d.Longitude, d.Latitude])
         if (coords)
        {return coords[1]
        }
      })
      
//version without filtering
/*
svg.selectAll(".ufo-circle")
.transition()
.delay(750)
.attr("r", function(d) {
if(d.Step == step) { return 10 } else { return 0 }
})

*/

}, 500)



  }

})();

