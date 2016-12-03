(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "ufos_geocoded.csv")
    .await(ready)

  d3.select("#country-display").style("display", "none");
/*
  var projection = d3.geoAlbersUsa()
    .translate([ width / 2, height / 2 ])
    .scale(850)

  var path = d3.geoPath()
    .projection(projection)

      */

var lengthScale = d3.scalePoint().domain(['Sphere','Circle','Oval','Light','Other','Diamond','Unknown','Triangle','Fireball']).range([height, 0]);


var colorScale = d3.scaleOrdinal().range(['gray', 'yellow', 'red', 'orange', 'blue', 'black', 'pink', 'green']);

var xPositionScale = d3.scaleLinear().domain([1,364]).range([0, width]);



  function ready (error, data, ufos) {

    /*

    console.log(data)
    var states = topojson.feature(data, data.objects.states).features;

    console.log(states)

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

 */
   
    svg.selectAll(".ufo-circle")
      .data(ufos)
      .enter().append("circle")
      .attr("class", "ufo-circle")
      .attr("r", 5)
      .attr("fill", function(d) {
      return colorScale(d.Shape);
    })
      .attr("opacity", 0.7)
      .attr("cy", function(d) {
        if (d.Shape)
          {return lengthScale(d.Shape)}
      })
      .attr("cx", function(d) {
        if (d.Date_Time)
          {return xPositionScale(d.Step)};
  })
      .on('mouseover', function(d) {
        // When you hover over a circle
        // select that circle and make it red
        d3.select(this).attr("fill", "red");
        // fill in the div with id="selected" with the country's name
        d3.select("#selected").text(d.Summary);
        // and show the country display hover
        d3.select("#description-display").style("display", "block");
        // NOTE: #selected is inside of #country-display
      })
      .on('mouseout', function(d) {
        // When you stop hovering over a circle
        // hide the country display
        d3.select("#country-display").style("display", "none");
        // and make the circle revert to its original color
        // originally this would be .attr("fill", "black")
        d3.select(this).attr("fill", colorScale(d.Shape));
      })

/* My goal for this chart is to arrange in line graphs, and then move into shape clusters
and the map. Instead of a bubble circle chart, would it be possible to send them into
shapes that are not spheres? (Such as triangle, etc?)

*/


  }

})();