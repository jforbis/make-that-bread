// reading in my data
function plotData(subject) {
    d3.json("data/samples.json").then((importedData) => {
    // console.log(importedData);
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

    // data to display per subject
    let meta = importedData.metadata;
    // console.log(meta);
    let filteredMeta = meta.filter(obj => obj.id == subject)[0];
    console.log(filteredMeta);
    let subjectInfo = d3.select("#sample-metadata");
    subjectInfo.html("");
    Object.entries(filteredMeta).forEach((key,value) => {
        subjectInfo.append("div").text(key[0] + ": " + key[1]);
    });
})
}

plotData();



// what to do when you change the drop-down list
function optionChanged(subject) {
    plotData(subject);
}

// original page load
function showData(subject) {

    d3.json("data/samples.json").then((importedData) => {
        let selDropdown = d3.select("#selDataset");

        importedData.names.forEach((value) => {
            let option = selDropdown.append("option");
            option.text(value).property("value", value);
        });
        // importedData.names.forEach(function(name) {
        //     selDropdown.append("option").text(name).property("value");
        // });
        // plotData();
    });
}

showData();