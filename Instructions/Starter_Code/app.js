// Pull in json file data

function PlotData(id) {
  d3.json("Data/samples.json").then((d)=> {
      console.log(d)

      var wfreq = d.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
      
      // Filter sample values by id 
      var samples = d.samples.filter(s => s.id.toString() === id)[0];
      
      console.log(samples);

      // Secet the top 10
      var samplevalues = samples.sample_values.slice(0, 10).reverse();

      // Order the top ten IDs in descending order
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      
      var OTU_id = OTU_top.map(d => "OTU " + d)

      // Grab the labels
      var labels = samples.otu_labels.slice(0, 10);

      // Trace variable for Bar Plot
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: 'rgb(100,200,300)'},
          type:"bar",
          orientation: "h",
      };

      var data = [trace];

      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 75,
              r: 100,
              t: 50,
              b: 75
          }
      };

      // Bar Plot
      Plotly.newPlot("bar", data, layout);
    
      // Trace variable for Bubble
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels

      };

      var layout_b = {
        title: "OTU Frequency per ID",
          xaxis:{title: "OTU ID"},
          height: 500,
          width: 750
      };

      var data1 = [trace1];

      // Bubble Plot
      Plotly.newPlot("bubble", data1, layout_b); 
    });
}  

// Pull in json file data for metadata

function MetaData(id) {
  d3.json("Data/samples.json").then((d)=> {
      
      // Variable for metadata
      var metadata = d.metadata;

      console.log(metadata)

      // // Filter metadata values by id 
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      // Variable for demographic panel
      var demographicInfo = d3.select("#sample-metadata");
      
      // Clear panel for new selection
      demographicInfo.html("");

      // grab the necessary demographic data data for the id and append the info to the panel
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

// Change event function
function optionChanged(id) {
  PlotData(id);
  MetaData(id);
}

// Drop down function
function init() {

  // Variable for dropdown
  var dropdown = d3.select("#selDataset");

  // Read the data
  d3.json("Data/samples.json").then((d)=> {
      console.log(d)

      // Display the data
      d.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      PlotData(d.names[0]);
      MetaData(d.names[0]);
  });
}

init();