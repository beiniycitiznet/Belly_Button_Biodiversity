// IMPORTANT: Use Live Server to run HTML

// Import data from samples.json
var otuData=d3.json("data/samples.json").then((incomingData) => {
    var dataset=incomingData;

    // Create a list to store all OTU IDs
    var otuId=dataset.samples.map(sample=>sample.id);

    // Add selection options in the selection dropdown
    var option=d3.select("#selDataset")
        .selectAll("option")
        .data(otuId)
        .enter()
        .append("option")
        .attr("value", function(data){
            var number=data.split(",");
            return number;
        })
        .text(function(data){
        var number=data.split(",");
        return number;
    });


    // Create horizontal bar chart
    function initBar(num){
            
        // Create empty lists to store data used to plot bar graph
        var barValues=[];
        var barLabels=[];
        var barHoverTexts=[];

        // Filter dataset by OTU id
        var filteredDate=dataset.samples.filter(sample=>sample.id.toString()===num.toString())[0];

        // Get data from the top 10 OTUs
        for (var i=0; i<10; i++){

            // Set x,y, and text 
            var barValue=filteredDate.sample_values[i];
            barValues.push(barValue);

            var barLabel=filteredDate.otu_ids[i];
            barLabels.push(`OTU ${barLabel}`);

            var hoverText=filteredDate.otu_labels[i];
            barHoverTexts.push(hoverText);
        };

        // Set trace, data, and layout, and plot bar graph
        var traceBar={
            y:barLabels,
            x:barValues,
            text:barHoverTexts,
            type:"bar",
            orientation:"h",
            marker:{
                color: "#3cb371"
            }
        };
        var dataBar=[traceBar];
        var layoutBar={
            title:"OTU's Sample Values"
        };

        Plotly.newPlot("bar", dataBar, layoutBar);
    };

    // Create bubble chart
    function initBubble(num){

        // Create empty lists to store data used to plot bar graph
        var bubbleXs=[];
        var bubbleYs=[];
        var bubbleSize=[];
        var bubbleTexts=[];

        // Filter dataset by OTU id
        var filteredDate=dataset.samples.filter(sample=>sample.id.toString()===num.toString())[0];
        
        // Set x, y, size, color, and text
        bubbleXs=filteredDate.otu_ids;

        bubbleYs=filteredDate.sample_values;

        bubbleTexts=filteredDate.otu_labels;

        bubbleSize=bubbleYs.map(y=>y/3*2);

        // Set trace, data, and layout, and plot bar graph
        var traceBubble={
            x:bubbleXs,
            y:bubbleYs,
            mode:"markers",
            marker:{
                size:bubbleSize,
                color:bubbleXs
            },

            text:bubbleTexts
        };
        var dataBubble=[traceBubble];
        var layoutBubble={
            title: "OTU Samples",
            xaxis:{
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    };

    // Create Demographic Information table 
    function initTable(num){

        // Filter dataset by OTU id
        var filteredDate=dataset.metadata.filter(sample=>sample.id.toString()===num.toString())[0];


        // Create an list to store demographic information
        var valueList=Object.values(filteredDate);
        var valueKey=Object.keys(filteredDate);
        var demoInfo=[]
        for (var i=0;i<valueKey.length;i++){
            var element=`${valueKey[i]}: ${valueList[i]}`
            demoInfo.push(element);
        };

        // Add Demographic Information table in HTML
        var panel=d3.select("#sample-metadata")
        var panelBody=panel.selectAll("p")
            .data(demoInfo)
            .enter()
            .append("p")
            .text(function(data){
                var number=data.split(",");
                return number;
            });
            
    };

    function initGauge(num){
        // Filter dataset by OTU id
        var filteredDate=dataset.metadata.filter(sample=>sample.id.toString()===num.toString())[0];

        // Set values
        var washF=filteredDate.wfreq;

        // Set trace, data, and layout, and plot bar graph
        var data = [{
            values: [9, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            labels: ["Scrubs per Week","0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
            marker: {
                colors: [
                    "white",
                    "#e9f0e8",
                    "#dcf7d5",
                    "#ccf7c1",
                    "#bbf7ad",
                    "#a5fa91",
                    "#8ed87e",
                    "#74b166",
                    "#5c8d51",
                    "#385731"
                ]
            },
            domain: {"x": [0, 45]},
            name: "Gauge",
            hole: .5,
            type: "pie",
            direction: "clockwise",
            rotation: 90,
            showlegend: false,
            textinfo: "label",
            textposition: "inside",
            hoverinfo: "none"
        }],

        layout = {
            xaxis: {
                showticklabels: false,
                showgrid: false,
                zeroline: false,
            },
            yaxis: {
                showticklabels: false,
                showgrid: false,
                zeroline: false,
            },
            shapes: [
                {
                    type: 'path',
                    path: `M 0.5 0.5 L ${0.5+0.3*Math.cos(Math.PI/9*(9-washF))} ${0.5+0.3*Math.sin(Math.PI/9*(9-washF))} L 0.5 0.55 Z`,
                    fillcolor: 'rgba(44, 160, 101, 0.5)',
                    line: {
                        width: 0.4
                    }
                }
            ],
            annotations: [
                {
                    x: 0.5,
                    y: 0.4,
                    text: washF,
                    showarrow: false
                }
            ],
            title:"Belly Button Washing Frequency"
        }

        Plotly.newPlot("gauge",data,layout);
    };

    // Create a function that will plot the initial graph
    function init(){

        // Call functions to create graphs
        initBar("940");
        initBubble("940");
        initTable("940");
        initGauge("940");
    };

    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    // Create a function that will graph plots after selection is updated
    function updatePlotly(){
        
        // Empty graphs and demographic information table
        d3.selectAll(".plot-container").remove();
        d3.select("#sample-metadata").selectAll("p").remove();

        // Get OTU ID
        var indexVal=d3.select("#selDataset").property("value");

        // Call functions to create graphs
        initBar(indexVal);
        initBubble(indexVal);
        initTable(indexVal);
        initGauge(indexVal);
    }

init();



});

