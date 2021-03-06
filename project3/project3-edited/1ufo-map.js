(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#map")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "ufos_geocoded.csv")
    .await(ready)

  /* 
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale)
  */
  // var projection = d3.geoMercator()
  //   .translate([ width / 2, height / 2 ])
  //   .scale(100)

  var projection = d3.geoAlbersUsa()
    .translate([ width / 2, height / 2 ])
    .scale(850)

  /*
    create a path (geoPath)
    using the projection
  */

  var path = d3.geoPath()
    .projection(projection)

  function ready (error, data, ufos) {

    /*
      topojson.feature converts
      our RAW geo data into USEABLE geo data
      always pass it data, then data.objects.___something___
      then get .features out of it
    */
    console.log(data)
    var states = topojson.feature(data, data.objects.states).features;

    console.log(states)
    /*
      add paths for each country
    */

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

    //Add the cities
   
    var chineseDatapoints = datapoints.filter(function(d) {
      return d.name_chinese != "";
    })


    svg.selectAll(".ufo-circle")
      .data(ufos)
      .enter().append("circle")
      .attr("class", "ufo-circle")
      .attr("r", 5)
      .attr("fill", "yellow")
      .attr("opacity", 0.7)
      .attr("cx", function(d) {
        // Taking our longitude and latitude columns
        // converting them into pixel coordinates 
        // on our screen
        // and returning the first one (the x)
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

/*
My goal for this chart is an animation over time, a la
http://www.slate.com/articles/life/the_history_of_american_slavery/2015/06/animated_interactive_of_the_history_of_the_atlantic_slave_trade.html
(without movement, just appearing and disappearing)
I'm still working on getting the setInterval function working -- I have the data in
"Steps" according to days and my goal is to draw and erase each day's dots as it moves throughout the year.

*/


  }

})();