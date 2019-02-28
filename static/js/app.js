function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metaUrl = "/metadata/" + sample;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metaUrl).then(function(data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMeta = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMeta.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function([key, value]) {
      var row = sampleMeta.append("h5").text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartUrl = "/samples/" + sample;
  d3.json(chartUrl).then(function(data) {
    var x = data.otu_ids;
    var y = data.sample_values;
    var color = data.otu_ids;
    var size = data.sample_values;
    var labels = data.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: x,
      y: y,
      text: labels,
      mode: "markers",
      marker: {
        color: color,
        size: size
      }
    };

    // Set data as "trace1"
    var bub_data = [trace1];

    // Layout
    var layout = {
      title: "OTU IDs"
    };

    // Use Plotly to graph data
    Plotly.newPlot("bubble", bub_data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each)
    var pie_vals = data.sample_values.slice(0,10);
    var pie_labs = data.otu_ids.slice(0,10);
    var hover = data.otu_labels.slice(0,10);

    // Set data for pie
    var pie_data = [{
      values: pie_vals,
      labels: pie_labs,
      hovertext: hover,
      type: "pie"
    }];

    // Use Plotly to graph the pies
    Plotly.newPlot("pie", pie_data);
  })
};

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {

  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
