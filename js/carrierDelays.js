
//Select the chart container as the location for the graph and set the size
var svg = dimple.newSvg("#chartContainer", "100%", 550);

//load the data
d3.csv("./data/data.csv", function (data){

  //debug - Make sure the correct data is being loaded
  //console.log(data);

  //create the chart variable and attach the loaded data
  var chart = new dimple.chart(svg, data);

  //Set the x axis of the chart and order the hours of the day from 1 to 24
  var x = chart.addCategoryAxis("x", "Time of Day (Hour)");
  x.addOrderRule([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);

  //Set the y axis of the chart and set the minimums and maximum so that it doesnt bounce everytime a new year is added
  var y = chart.addMeasureAxis("y", "Delay Profile");
  y.overrideMax = 8;
  y.overrideMin = -0.25;

  //Create the chart with the carrier as the
  chart.addSeries("Carrier", dimple.plot.bar);

  //Add text to the legend
  svg.selectAll("legend_title")
    .data(["Carriers (Click to Select/Deselect):"])
    .enter().append("text")
    .attr("x", 20).attr("y", 40)
    .style("font-family", "sans-serif").style("font-size", "12px").style("color", "Black")
    .text(function (d) { return d; });

  //Add the legend, making sure that it aligns with the description text
  var legend = chart.addLegend(175, 25, 500, 40, "right")

  //create the frames for the animation.
  var storyBoard = chart.setStoryboard("Year", onTick);

  //draws the chart for the first time. Will animate based on the frames created by the setStoryboard function
  chart.draw()

  //Sets the initial conditions. Will pause the animation on load and set the buttons to the correct state. This code will also display the welcome banner.
  storyBoard.pauseAnimation();
  document.getElementById("play").disabled = true;
  document.getElementById("pause").disabled = true;
  //Displayed to the user when the page is first accessed
  d3.select("#welcomeButton")
    .on("click", function(e){
      //Hide the welcome text and the welcome rectangle
      console.log("fired");
      d3.select("#welcome")
        .attr("style", "display:none");

      //start the animation when the welcome square is clicked.
      storyBoard.startAnimation();
      document.getElementById("play").disabled = true;
      document.getElementById("pause").disabled = false;
    });

  /*Below is code that is based and adapted from the examples at dimplejs.org
  References:
  - http://dimplejs.org/advanced_examples_viewer.html?id=advanced_interactive_legends
  */

  //Orphan the legend so that it can be re-drawn when clicked
  chart.legends = [];

  // Get a unique list of Owner values to use when filtering
  var filterValues = dimple.getUniqueValues(data, "Carrier");

  // Select all of the rectangles in the legend
  legend.shapes.selectAll("rect")
    // Add a click event to each rectangle
    .on("click", function (e) {
      var hide = false;
      var newFilters = [];
      // If the filters contain the clicked shape hide it
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });

      //If the rectangle in the legend has been clicked, increase the opacity, else, set the opacity
      if (hide) {
          d3.select(this).style("opacity", 0.2);
        } else {
          newFilters.push(e.aggField.slice(-1)[0]);
          d3.select(this).style("opacity", 0.8);
        }
        // Update the filters based on those that have been clicked
        filterValues = newFilters;
        // Filter the data based on which Carriers have been selected
        chart.data = dimple.filterData(data, "Carrier", filterValues);

        //toggle the buttons because when a carrier is re-added the chart is re-drawn
        if(document.getElementById("pause").disabled == true){
          console.log("paused")
          document.getElementById("play").disabled = true;
          document.getElementById("pause").disabled = false;
        }

    //re-draw the chart so that the clicked legend rectangles will add/remove themselves
    chart.draw(500);
    });


  //Redraw the chart when the window is resized. Set the button states so that it can be re-paused as necessary
  window.onresize = function() {
    chart.draw(0, true)
    document.getElementById("play").disabled = true;
    document.getElementById("pause").disabled = false;
  }

  //Fucntion to set the year in the controls
  function setYear(e){
    document.getElementById('year').innerHTML = e;
  }

  //Function to pause the animation when the pause button is clicked. Also toggles the button states
  d3.select("#pause")
    .on("click", function(d, i){
      document.getElementById("pause").disabled = true;
      document.getElementById("play").disabled = false;
      storyBoard.pauseAnimation();
    });

  //Function to play the animation when the play button is clicked. Also toggles the button states
  d3.select('#play')
    .on("click", function(d, i){
      document.getElementById("pause").disabled = false;
      document.getElementById("play").disabled = true;
      storyBoard.startAnimation();
    });

  //Funtion that fires when the animation is moved to the next frame
  function onTick(e){
    document.getElementById("play").disabled = true;

    //Remove the old slider element. These are necessary to there is no redraw
    d3.select('#handle-one').remove();
    d3.select('.d3-slider-axis').remove()

    //document.getElementById('year').innerHTML = e;
    setYear(e);

    //select the slider and draw it
    d3.select('#slider')
      .call(d3.slider()
        .axis(true)
        .min(1988)
        .max(2008)
        .step(1)

        //When the slider has been slid by the user, it will set the animation to a given frame
        .on("slide", function(evt, value){

          //Go to a frame when the slider is moved and pause the animation
          storyBoard.goToFrame(String(value));
          setYear(value);
          storyBoard.pauseAnimation();

          //Update the button states so that the animation can be resumed
          document.getElementById("play").disabled = false;
          document.getElementById("pause").disabled = true;
        })

        //Set the slider to the animation frame
        .value(e)
      );
  };
});

//Initialize the tabs
$('#myTabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
