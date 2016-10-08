// Kate Bennion
// October 7
// PUT THE DESCRIPTION OF WHAT THIS FILE IS DOING HERE
(function() {
  var margin = { top: 30, left: 30, right: 150, bottom: 30},
    height = 700 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;

  var svg = d3.select("#visitors_century")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

  // Create any scales you might need
  var xPositionScale = d3.scaleLinear().domain([1907,2015]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([0,11000000]).range([height, 0]);
  var colorScale = d3.scaleOrdinal().range(['#e6b800','#668cff','#b2df8a','#666666','#f9f2ec']);


//['#666666','#668cff','#b2df8a','#ccccb3','#f9f2ec']
 // #666666


  // https://github.com/d3/d3-shape#curves
  var line = d3.area()
    .x(function(d) { return xPositionScale(d.Year); })
    .y1(function(d) { return yPositionScale(d.Recreation_Visitors); })
    .y0(height)
    .curve(d3.curveBasis);

  d3.queue()
    .defer(d3.csv, "parks_year.csv")
    .await(ready);

  function ready(error, datapoints) {

    var nested = d3.nest()
      .key( function(d) { 
        return d.Park;
      })
      .entries(datapoints);

    console.log(nested);

    var x = d3.scaleOrdinal()
    .domain(["1910", "1930", "1950", "1970", "1990", "2010"])
    .range([0, width]);

  svg.append("line")          // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", 0)     // x position of the first end of the line
    .attr("y1", 351)      // y position of the first end of the line
    .attr("x2", width)     // x position of the second end of the line
    .attr("y2", 351)
    .attr("opacity", .50)
    .attr("stroke-width", 2);

    svg.append("line")          // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", 0)     // x position of the first end of the line
    .attr("y1", 61)      // y position of the first end of the line
    .attr("x2", width)     // x position of the second end of the line
    .attr("y2", 61)
    .attr("opacity", .50)
    .attr("stroke-width", 2);  

    svg.append("text")
    .attr("x", 60)
    .attr("y", 345)
    .attr("dy", 5)
    .attr("dy", 4)
    .text("5 million")
    .attr("font-size", 12)
    .attr("font-weight", "bold")

    svg.append("text")
    .attr("x", 60)
    .attr("y", 56)
    .attr("dy", 5)
    .attr("dy", 4)
    .text("10 million")
    .attr("font-size", 12)
    .attr("font-weight", "bold")

    // Create and style your elements
    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("class", "line")
      .attr("fill", function(d) {
        return colorScale(d.key);
      })
      .attr("opacity", 0.40)
      .attr("d", function(d) {
        return line(d.values);
      });

    svg.selectAll("text")
      .data(nested)
      .enter().append("text")
      .attr("y", function(d) {
        var lastDataPoint = d.values[d.values.length-3];
        return yPositionScale(lastDataPoint.Recreation_Visitors)
      })
      .attr("x", width)
      .text(function(d) {
        return d.key;
      })
      .attr("dy", 5)
      .attr("dx", 4)
      .attr("fill", function(d) {
        return colorScale(d.key);
      })
      .attr("font-size", 12)
      .attr("font-weight", "bold")


    var xAxis = d3.axisBottom(xPositionScale);
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  }

})();