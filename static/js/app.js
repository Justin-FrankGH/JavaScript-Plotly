dataPath = "/data/samples.json";

let dropdown = document.getElementById('selDataset');
dropdown.length = 0;

let defaultOption = document.createElement('option');
defaultOption.text = 'Choose ID';

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const url = dataPath;

fetch(url)  
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.warn('Looks like there was a problem. Status Code: ' + 
          response.status);  
        return;  
      }

      // Examine the text in the response  
      response.json().then(function(data) {  
        let option;
    
    	for (let i = 0; i < data.samples.length; i++) {
          option = document.createElement('option');
      	  option.text = data.samples[i].id;
      	  option.value = data.samples[i].id;
      	  dropdown.add(option);
    	}    
      });  
    }  
  )  
  .catch(function(err) {  
    console.error('Fetch Error -', err);  
  });

var promise = d3.json(dataPath)

d3.selectAll("#selDataset").on("change", makeCharts);

function makeCharts() {
    promise.then(function(sampleData) {

        console.log(sampleData);

        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");

        console.log(dataset)

        var names = sampleData.names;
        var metadata = sampleData.metadata;
        var samples = sampleData.samples;

        console.log(samples);

        var index = -1;
        var filteredObj = samples.find(function(item, i){
        if(item.id === dataset){
            index = i;
            return i;
        }
        });

        console.log(index, filteredObj);

        function makeBar() {

            var values = filteredObj.sample_values.slice(0,10).sort((a,b) => a-b);
            var ids = (filteredObj.otu_ids.slice(0,10).sort((a,b) => a-b)).map(id => "OTU " + id);
            var labels = filteredObj.otu_labels.slice(0,10).sort((a,b) => a-b);
            
            var trace1 = {
                type: "bar",
                y: ids,
                x: values,
                orientation: 'h',
                hovertext: labels,
            };

            var barData = [trace1];

            var layout = {
                title: "Top Ten Sample Values",
                xaxis: {title: "OTU IDs"},
                yaxis: {title: "Sample Value"}
            };

            Plotly.newPlot("bar", barData, layout)
        };

        makeBar();

        function makeBubble() {
            var valuesBubble = filteredObj.sample_values;
            var idsBubble = filteredObj.otu_ids;
            var labelsBubble = filteredObj.otu_labels;
            
            var trace2 = {
                x: idsBubble,
                y: valuesBubble,
                text: labelsBubble,
                mode: 'markers',
                marker: {
                    color: idsBubble,
                    size: valuesBubble
                }
            };
                
            var dataBubble = [trace2];
            
            var layoutBubble = {
                title: 'Sample Data Bubble Chart',
                showlegend: false
            };
              
            Plotly.newPlot("bubble", dataBubble, layoutBubble)
        }

        makeBubble();

        function fillMetadata() {
            var list = d3.select("#sample-metadata");

            list.html("");

            list.append("p").text(`id: ${metadata[index].id}`);
            list.append("p").text(`ethnicity: ${metadata[index].ethnicity}`);
            list.append("p").text(`gender: ${metadata[index].gender}`);
            list.append("p").text(`age: ${metadata[index].age}`);
            list.append("p").text(`location: ${metadata[index].location}`);
            list.append("p").text(`bbtype: ${metadata[index].bbtype}`);
            list.append("p").text(`wfreq: ${metadata[index].wfreq}`);
            
        }

        fillMetadata();

    });
};

makeCharts();
