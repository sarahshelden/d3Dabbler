// @TODO: YOUR CODE HERE!

// citing Activity 16-3-12 from class repo 


var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


//creating x-axis

var xAxis = "Poverty";

// function used for updating x-scale var upon click on axis label
function xScale(data, xAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[xAxis]) * 0.8,
        d3.max(data, d => d[xAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;

    };

    // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAx) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAx;
  }

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, xAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[xAxis]));
  
    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(xAxis, circlesGroup) {

    if (xAxis === "poverty") {
      var label = "Poverty";
    }
    else if (xAxis === "income"){
        var label = "income"
    } else if (xAxis === "healthcare"){
        var label = "healthcare"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.poverty}<br>${label} ${d[xAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
  // Retrieve data from the CSV file and execute everything below
  d3.csv("data.csv", function(err, data) {
    if (err) throw err;
  
    // parse data
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.income = +data.income;
      data.healthcare= +data.healthcare;
    });
});
// xLinearScale function above csv import
var xLinearScale = xScale(data, xAxis);

// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.poverty)])
  .range([height, 0]);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
chartGroup.append("g")
  .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[xAxis]))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 20)
  .attr("fill", "pink")
  .attr("opacity", ".5");