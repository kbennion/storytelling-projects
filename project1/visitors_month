(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#visitors_month")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var angleScale = d3.scalePoint()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Placeholder'])
    .range([0, Math.PI * 2]);

  var colorScale = d3.scaleLinear().domain([0, 100]).range(['blue', 'orange']);

  var radius = 100;

  var radiusScale = d3.scaleLinear()
    .domain([0, 12000000])
    .range([0, radius]);

    var pie = d3.pie()
    .sort(null)
    .value(Math.PI / 12);

//////

  var arc = d3.arc()
    .outerRadius(radiusScale)
    .innerRadius(0);

  var labelArc = d3.arc()
      .outerRadius(radiusScale + 10)
      .innerRadius(radiusScale + 10);

  d3.queue()
    .defer(d3.csv, "yosemite_months.csv")
    .await(ready)

  function ready(error, datapoints) {
    pieHolder = svg.append("g").attr("transform", "translate(300,200)");

    var g = pieHolder.selectAll(".arc")
        .data(pie(datapoints))
        .enter().append("g");

    g.append("path")
        .attr("d", arc)
        .attr("r", function(d) {
          return radiusScale(d.visitors)
        })
        .attr("fill", function(d) {
          return colorScale(d.temp);
        })

     pieHolder.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 2)
      .attr("fill", "black")

  }
})();