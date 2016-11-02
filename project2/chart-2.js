(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 700 - margin.top - margin.bottom,
    width = 960 - margin.left - margin.right;

 
  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear().domain([1950,2012]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([20,80]).range([height, 0]);
  var GDPScale = d3.scaleLinear().domain([0,100000]).range([height, 0]);
  var StrokeScale = d3.scaleLinear().domain([1000000, 2000000000]).range([1, 50]);
  
  var colorScale = d3.scaleOrdinal().domain(['Asia', 'Europe', 'Africa', 'N. America', 'S. America', 'Oceania']).range(['red','blue','purple','yellow','gray','orange', 'black']);


d3.select("#country-display").style("display", "none");

  var line = d3.line()
  .x(function(d) {
    return xPositionScale(d.Year);
  })
  .y(function(d) {
    return yPositionScale(d.life_expectancy);
  });

  var line1 = d3.line()
  .x(function(d) {
    return xPositionScale(d.Year);
  })
  .y(function(d) {
    return GDPScale(d.GDP_per_capita);
  });


  d3.queue()
    .defer(d3.csv, "country-data.csv")
    .await(ready)


  function ready(error, datapoints) {

  var nested = d3.nest()
  .key(function(d) { return d.Country })
  .entries(datapoints);

  svg.selectAll(".gdp-lines")
.data(nested)
.enter().append("path")
.attr("d", function(d) { return line1(d.values); })
/*.attr("class", function(d) {
        var countryClass = d.Country.toLowerCase().replace(" ", "-").replace(".", "")
      }) */
.attr("opacity", 0)
.attr("fill", "none")
.attr("stroke", "green")
;


  svg.selectAll(".country-lines")
  .data(nested)
  .enter().append("path")
  .attr("d", function(d) { return line(d.values); })
  .attr("opacity", .5)
  .attr("fill", "none")
  .attr("stroke", function(d) {
    return colorScale(d.Continent)
  })
  .attr("stroke-width", function(d) {
    return StrokeScale(d.Population);
  })
  /*.attr("class", function(d) {
        // if we want to select by continent later, we should add
        // the continent as a class now
        // be sure to 1) lowercase 2) remove the spaces 3) remove the period
        // so N. America would become class="country-circle n-america"
        var continentClass = d.Continent.toLowerCase().replace(" ", "-").replace(".", "")
        var countryClass = d.Country.toLowerCase().replace(" ", "-").replace(".", "")
      }) */
  .on('mouseover', function(d) {
        d3.select(this).attr("stroke", "blue").attr("stroke-width", 3);
        d3.select("#selected").text( function (d) { return d.Country; });
        d3.select("#country-display").style("display", "block");       
      })
  .on('mouseout', function(d) {
        d3.select("#country-display").style("display", "none");
        d3.select(this).attr("stroke", colorScale(d.Continent)).attr("stroke-width", 1);
      })
  .on('click', function(d) {
    svg.select(".gdp-lines").style("display", "block");
  })

    ;


//  d3.select("#africa-button").on('click', function(d) {

      // to "zoom in", we need to pick out ONLY the asian 
      // data points so we can get the max/min of
      // GDP and life expectancy and change the axes
      var asiaDatapoints = datapoints.filter(function(d) { 
        return d.Continent == "Africa";
      })



d3.selectAll(".continent-button").on('click', function(d) {
      // grab the element
      // and get its data-continent attribute
      var continent = d3.select(this).attr('data-continent');

      d3.selectAll(".country-circle").attr("opacity", 0.2)
      d3.selectAll(".country-circle")
        .filter(function(d) {
          // In METHOD TWO we just compared to "Asia",
          // but here we just use the variable we took
          // out of the HTML tag
          return d.Continent == continent
        })
        .attr("opacity", 1)
    })





d3.select("#named-select")
.on('change', function() {

  console.log(this.value);
  d3.selectAll(".country-lines").attr("opacity", 0.2)
  d3.selectAll(".Africa").attr("opacity", 1)
});

  /* svg.append("path")
    .datum(datapoints)
    .attr("d", line) 
    .attr("fill", "none")
    .attr("stroke", function(d) {
    return colorScale(d.Continent);
  })
    .attr("stroke-width", function(d) {
    return StrokeScale(d.Population);
  });
*/

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis);


 svg.selectAll(".x-axis text").text(function(d) { 
      switch(d) {
        case 1955: return "1955";
        case 1965: return "1965";
        case 1975: return "1975";
        case 1985: return "1985";
        case 1995: return "1995";
        case 2005: return "2005";
      }
      return " "})
  
    .attr("transform"," translate(0,15) rotate(-55)")
    .style("font-size","13px")
    .attr("opacity", 1);
    

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var yAxis2 = d3.axisRight(GDPScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("opacity", 0)
      .call(yAxis2);

  }
})();