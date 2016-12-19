(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 1000 - margin.top - margin.bottom,
    width = 1600 - margin.left - margin.right;

  var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "smaller_ufos.csv")
    .await(ready)

  d3.select("#country-display").style("display", "none");

  var projection = d3.geoAlbersUsa()
    .translate([ width / 2, height / 2 ])
    .scale(1200)

  var path = d3.geoPath()
    .projection(projection)

var xPositionScale = d3.scalePoint()
                      .domain(['Sphere','Circle','Oval','Light','Other','Diamond','Unknown','Triangle','Fireball'])
                      .range([0, width]);


var lengthScale = d3.scalePoint().domain(['Sphere','Circle','Oval','Light','Other','Diamond','Unknown','Triangle','Fireball']).range([height, 0]);

var colorScale = d3.scaleOrdinal().range(['#FDFDFD', '#FEEBB1', '#CC2545', '#EF7159', '#0382CC', '#301A5B', '#D65E85', '#2497D0']);



var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force("collide", d3.forceCollide(function(d) {
      return circleRadius + 2
    }))



  function ready (error, data, ufos) {

    // console.log(ufos)
    var grouped = d3.nest()
    .key(function(d) { return d.Step; })
    .entries(ufos);

    var yPositionScale = d3.scalePoint()
    .domain(d3.range(300))
    .range([height, 0])

    // You tell it how far apart to put the circles
    var circleSpacing = 0.5;

    // And it will automatically calculate a radius
    var circleRadius = (yPositionScale(0) - yPositionScale(1)) / 2 - circleSpacing;

    var xPositionScale = d3.scalePoint()
      .domain(grouped.map(function(d, i) {
        return '' + i;
      }))
      .range([0, width])
      .padding(.5);


    // ufos.forEach(function(d) {
    //   if (Object.keys(day_data).indexOf(d.Step) !== -1) {
    //     day_data[d.Step] += 1;
    //   } else {
    //     day_data[d.Step] = 1;
    //   }
    // })
    // console.log(day_data)

    // {1: 10, 2: 44, ...}

    // loop through our day data
    // for each day, we want to draw a line of circles
    // we want to draw as many circles as the count

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
    var groups = svg.selectAll(".day_group")
      .data(grouped)
      .enter().append("g")
      .attr("class", "day_group")

    groups.selectAll(".ufo-circle")
      .data(function(d) {
        return d.values;
      })
      .enter().append("circle")
      .attr("class", "ufo-circle")
      .attr("r", circleRadius)
      .attr("fill", function (d) {
        return colorScale(d.Shape);})
      .attr("opacity", 0.7)
     .attr("cy", function(d, i) {
        if (yPositionScale(i + 1)) {
          return yPositionScale(i + 1) + circleRadius;
        } else {
          console.log(yPositionScale(i + 1));
        }
      })
      .attr("cx", function(d) {
        if (d.Step !== "") {
          return xPositionScale( '' + d.Step);
        } else {
          console.log(d.Step)
          return xPositionScale('0');
        }
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
        d3.select("#description-display").style("display", "none");
        // and make the circle revert to its original color
        // originally this would be .attr("fill", "black")
        d3.select(this).attr("fill", colorScale(d.Shape));
      })

           /*simulation.force("x", d3.forceX(function(d) {
          if(d.Shape == "Triangle") {
            return width * .25;
          }
          if(d.Shape == "Diamond") {
            return width * .75;
          }
        })
        .strength(0.1))
        .alphaTarget(0.5)
        .restart()

        */

/*simulation.nodes(datapoints)
      .on('tick', ticked)
*/

      d3.select("#shape-button").on('click', function() {
        console.log('you clicked shapes')
      svg.selectAll(".ufo-circle")
        .transition()
        .duration(750)
        .attr("r", circleRadius)
        .attr("cx", function(d) {
          if(d.Shape == 'Triangle') {
            return 100;
          }
          if(d.Shape == 'Fireball') {
            return 200;
          }
          if(d.Shape == 'Oval') {
            return 300;
          }
          if(d.Shape == 'Sphere') {
            return 400;
          }
          if(d.Shape == 'Circle') {
            return 500;
          }
          if(d.Shape == 'Diamond') {
            return 600;
          }
          if (d.Shape == 'Other') {
            return 700;
          }
          if (d.Shape == 'Light') {
            return 800;
          }
          if (d.Shape == 'Unknown') {
            return 900;
          }
        })
        .attr("cy", function(d) {
          if(d.Shape == "Triangle"||d.Shape == "Fireball"||d.Shape == "Oval") {
            return 200;
          }
          else {
            return 500;
          }
        })
    })



           d3.select("#map-button").on('click', function() {
        console.log('you clicked maps')
      svg.selectAll(".ufo-circle")
        .transition()
        .duration(750)
        .attr("r", circleRadius)
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

    })

      /*
      svg.selectAll(".ufo-circle")
        .transition()
        .duration(750)
        .attr("r", function(d) {
          if(d.Shape == "Triangle") {
            return 2;
          } else {
            return 0;
          }
        })
        .attr("fill", "black")
        .attr("cx", 500)
        .attr("cy", 500)
    })
    */


      d3.select("#map-button").on('click', function() {
        console.log('you clicked maps')
      svg.selectAll(".ufo-circle")
        .transition()
        .duration(750)
        .attr("r", circleRadius)
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

    })





      // .attr("cx", function(d) {
        // Taking our longitude and latitude columns
        // converting them into pixel coordinates
        // on our screen
        // and returning the first one (the x)
      //   var coords = projection([d.Longitude, d.Latitude])
      //   if (coords)
      //   {return coords[0]
      //   }
      // })
      // .attr("cy", function(d) {
      //   var coords = projection([d.Longitude, d.Latitude])
      //    if (coords)
      //   {return coords[1]
      //   }
      // })



/* My goal for this chart is to arrange in line graphs, and then move into shape clusters
and the map. Instead of a bubble circle chart, would it be possible to send them into
shapes that are not spheres? (Such as triangle, etc?)

*/


  }

})();
