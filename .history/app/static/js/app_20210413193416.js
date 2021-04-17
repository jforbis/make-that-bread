// reading in my data
function plotData(subject) {
    d3.json("data/samples.json").then((importedData) => {
    console.log(importedData);
    // console.log(importedData.names);
    // console.log(importedData.metadata);
    // console.log(importedData.samples);

    let otuid = importedData.samples[0].otu_ids;
    // console.log(otuid)
    let otuid_topten = importedData.samples[0].otu_ids.slice(0,10).reverse();
    let samplevalues =  importedData.samples[0].sample_values;
    // console.log(samplevalues)
    let samplevalues_topten = importedData.samples[0].sample_values.slice(0,10).reverse();
    let hovertext =  importedData.samples[0].otu_labels
    // console.log (hovertext)
    let hovertext_topten =  importedData.samples[0].otu_labels.slice(0,10);
    let valuelabel = otuid.map(d => "OTU " + d);

    // bar chart
    let trace = {
    x: samplevalues_topten,
    y: valuelabel,
    text: hovertext_topten,
    type: "bar",
    orientation: "h"
    };

    let data = [trace];

    let layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Bacteria Values" },
    yaxis: { title: "OTUs" }
    };

    Plotly.newPlot("bar", data, layout);


    // bubble chart
    var trace2 = {
        x: otuid,
        y: samplevalues,
        mode: "markers",
        marker: {
            size: samplevalues,
            color: otuid,
        },
        text:  hovertext
    };

    let layout2 = {
        xaxis:{title: "OTU ID"},
    };

    let data2 = [trace2];

    Plotly.newPlot("bubble", data2, layout2); 



    // // data to display per subject
    // let meta = importedData.metadata;
    // // console.log(meta);
    // let filteredMeta = meta.filter(obj => obj.id == subject)[0];
    // // console.log(filteredMeta);
    // let subjectInfo = d3.select("#sample-metadata");
    // subjectInfo.html("");
    // Object.entries(filteredMeta).forEach((key,value) => {
    //     subjectInfo.append("div").text(key[0] + ": " + key[1]);
    // });
})
}

plotData();

// Show Stock Information



// what to do when you change the drop-down list
function optionChanged(subject) {
    plotData(subject);
}

// original page load
function showData(subject) {
    d3.json("data/stocks.json").then((importedData) => {
        let selDropdown = d3.select("#selDataset");
        importedData.ticks.forEach((value) => {
            let option = selDropdown.append("option");
            option.text(value).property("value", value);

        // let stockInfo = d3.select("#sample-metadata");
        // stockInfo.html("<h5><b>Company Name: </b>variable goes here</h5> <br><b>Open Price:</b>variable goes here <br><br><b>High: </b>variable goes here <br><br><b>Low: </b>variable goes here <br><br><b>Close Price: </b>variable goes here <br><br><b>Volume: </b>variable goes here");
        });
    });
}

showData();

function stockData(subject) {
    let apple = yf.Ticker("AAPL")
    let name = apple.info["longName"]
    console.log(name)
    return name;
}

stockData();

function stockSelected(objDropDown) {
    console.log(objDropDown);
    var objHidden = document.getElementById("hiddenInput");
    objHidden.value = objDropDown.value;
    var a = objHidden.value;
    result.innerHTML = a || "";
}