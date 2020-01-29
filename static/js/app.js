function buildMetadata(sample) {
    // Using `d3.json` to fetch the metadata for a sample
    // console.log(sample)
    d3.json("./static/data/samples.json").then(function(sampleData) {
      console.log(sampleData);

      //var id = sampleData.names[0];
      var metadataValues = Object.values(sampleData.metadata[0]);
      var metadataLabels = Object.keys(sampleData.metadata[0]).map(label=>label[0].toUpperCase()+label.slice(1));

      // Using d3 to select the panel with id of `#sample-metadata`

      var panel = d3.select("#sample-metadata").append("p");

      // Using `.html("") to clear any existing metadata
      panel.html("");

	  panel.html(`<strong>${metadataLabels[0]}:</strong> ${metadataValues[0]}</br>
                <strong>${metadataLabels[1]}:</strong> ${metadataValues[1]}</br>
                <strong>${metadataLabels[2]}:</strong> ${metadataValues[2]}</br>
                <strong>${metadataLabels[3]}:</strong> ${metadataValues[3]}</br>
                <strong>${metadataLabels[4]}:</strong> ${metadataValues[4]}</br>
                <strong>${metadataLabels[5]}:</strong> ${metadataValues[5]}</br>
                <strong>${metadataLabels[6]}:</strong> ${metadataValues[6]}`);

    })

}


function buildCharts(sample) {
    
    // Use `d3.json` to fetch the sample data for the plots
    // need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
     
    d3.json("./static/data/samples.json").then(function (sampleData) {
      
        var otu_ids = sampleData.samples[0].otu_ids;
        var otu_labels = sampleData.samples[0].otu_labels;
        var sample_values = sampleData.samples[0].sample_values;
      
        // Building a bar Chart

        var trace1 = {
            type: "bar",
            orientation: 'h',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).reverse().map(otu_id=>`OTU ${otu_id}`),
            text: otu_labels.slice(0,10).reverse()
        };

        var barData = [trace1];

        var barLayout = {
            title: "Top 10 OTUs",
            xaxis: {title: "Value"},
            yaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bar", barData, barLayout);

      
      //Building a Bubble chart

      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }];      

      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: {title: 'OTU ID'},
      };

      Plotly.plot('bubble', bubbleData, bubbleLayout);

    });

}


function init() {
    
    // Add test subject id #s to dropdown
    d3.json("./static/data/samples.json").then(function(sampleData){

        // Save data in variables
        var names = sampleData.names;
        
        // Grab a reference to the dropdown select element
        var dropdown = d3.select("#selDataset");
        
        // Use the list of sample names to populate the select options
        names.forEach((sample) => {
            dropdown.append("option")
                    .text(sample)
                    .property("value", sample);
        });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
}

  
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}


// Initialize the dashboard
init(); 