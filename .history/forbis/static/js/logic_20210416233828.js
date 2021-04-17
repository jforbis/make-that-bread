var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function buildStockGraph() {
    let ticker = d3.select("#selDataset").node().value;
    fetch('/get_data', {
        method: 'POST',
        body: JSON.stringify(ticker)
    })
        .then(function (response) {
            return response.json();
        }).then(function (text) {
            
            const data = text;

    fetch('/get_data2', {
        method: 'POST',
        body: JSON.stringify(ticker)
    })
        .then(function (response) {
            return response.json();

        })
        .then(function (text) {

            const name = text;
            const stock_logo = name["logo_url"]

            console.log(name['website']);
            console.log(stock_logo);
            console.log(ticker);
            console.log(data);

            let latest = data[data.length-1];
            let high = formatter.format(latest.High);
            let low = formatter.format(latest.Low);
            let open = formatter.format(latest.Open);
            let close = formatter.format(latest.Close);
            let volume = numberWithCommas(latest.Volume);

            document.getElementById("compname").innerHTML = "<b>Company: <br></b> " + name['longName'];
            document.getElementById("high").innerHTML = "<b>High: </b> " + high;
            document.getElementById("low").innerHTML = "<b>Low: </b> " + low;
            document.getElementById("open").innerHTML = "<b>Open: </b> " + open;
            document.getElementById("close").innerHTML = "<b>Close: </b> " + close;
            document.getElementById("volume").innerHTML = "<b>Volume: </b> " + volume;
            document.getElementById("url").innerHTML = "<a style='color: white;' target=blank href =" + name["website"] + ">Learn about the company!</a>"
            document.getElementById("logo").innerHTML = "<img class='card-img-top' src=" + stock_logo + " alt='Card image cap' style='max-width: 128px; padding: 5px;'></img>"
            document.getElementById("info").innerHTML = name["longBusinessSummary"]

            let dates = data.map(d => d.Date);
            let highs = data.map(d => d.High);
            let lows = data.map(d => d.Low);
            let opens = data.map(d => d.Open);
            let closes = data.map(d => d.Close);

            let trace = {
                x: dates,
                y: highs,
                // text: hovertext_topten,
                type: "line",
                name: "High",
                line: {
                    color: 'rgb(0,128,0)',
                    dash: 'dashdot',
                    width: 1
                }
                };

            let trace3 = {
                x: dates,
                y: opens,
                // text: hovertext_topten,
                type: "line",
                name: "Open",
                line: {
                    color: 'rgb(0,0,255)',
                    width: 1
                    }
                };

            let trace2 = {
                x: dates,
                y: lows,
                // text: hovertext_topten,
                type: "line",
                name: "Low",
                line: {
                    color: 'rgb(255, 0, 0)',
                    dash: 'dashdot',
                    width: 1
                }
                };
            var trace4 = {

                x: dates, 
                close: closes, 
                decreasing: {line: {color: 'rgb(255, 0, 0)'}}, 
                high: highs, 
                increasing: {line: {color: 'rgb(0,128,0)'}}, 
                line: {color: 'rgba(31,119,180,1)'}, 
                low: lows, 
                open: opens, 
                type: 'candlestick', 
                xaxis: 'x', 
                yaxis: 'y'
            };
            
            let graphdata = [trace, trace2, trace3];
            let graphdata2 = [trace4]

            let layout = {
            title: "'" + ticker + "'" + " Stock Prices",
            xaxis: { title: "Date",
                     type: "date" },
            yaxis: { title: "Price ($)" }
            };

            let layout2 = {
                title: "'" + ticker + "'" + " Candle Chart",
                xaxis: { title: "Date",
                         type: "date" },
                yaxis: { title: "Price ($)" }
                };
        
            Plotly.newPlot("line", graphdata, layout);
            Plotly.newPlot("candle", graphdata2, layout2);
        })
    })
    };

buildStockGraph();


//     fetch('/get_stock')
//         .then(function (response) {
//             return response.json();
//         }).then(function (text) {
//         const data = text;
    
//         let map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         titleSize: 600,
//         maxZoom: 10,
//         zoomOffset: 0,
//         id: "mapbox/streets-v11",
//         accessToken: API_KEY
//         });

//         let myMap = L.map("map", {
//             center: [39.0997,-94.5786], //**KC, MO**//
//             zoom: 4,
//         });

//         map.addTo(myMap);

//         let geojson;
//         fetch('/master')
//         .then(function (response) {
//             return response.json();
//         }).then(function (text) {
//         var data2 = text;
//         geojson = L.choropleth(data, {
//                 // Define what  property in the features to use
//         valueProperty: "density",

//         // Set color scale
//         scale: ["white", "#8B898C"],

//         // Number of breaks in step range
//         steps: 10,

//         // q for quartile, e for equidistant, k for k-means
//         mode: "q",
//         style: {
//         // Border color
//         color: "#8B898C",
//         weight: 2,
//         fillOpacity: 0.8
//         },
//         }).addTo(myMap);
//             // let pop = feature.properties.Population;
//             // console.log(pop);
//         L.geoJson(data2, {
//             pointToLayer: function(feature, latlng) {
//                 return L.circleMarker(latlng);
//             },
//             style: chooseStyle,

//             onEachFeature: function(feature, layer) {
//                 layer.bindPopup("<div class=header><b><u>State Name</u></b>: " + feature.properties.state + "</div><b>Capital: </b>" + feature.properties.Capital + "<br> <b>State Population: </b>" + feature.properties.Population + "<br> <b>Median Age: </b>" + feature.properties["Median Age"] + "<br> <b>Household Income: </b>" + feature.properties["Household Income"] + "<br> <b>Poverty Count: </b>" + feature.properties["Poverty Count"] + "<br> <b>Poverty Rate %: </b>" + feature.properties["Poverty Rate"]);
//             }
//         }).addTo(myMap);

//         function chooseStyle(feature) {
//             return {
//                 opacity: 1,
//                 fillOpacity: 1,
//                 fillColor: chooseColor(feature.properties.Population),
//                 color: "black",
//                 radius: chooseSize(feature.properties.Population),
//                 stroke: true,
//                 weight: 2
//             };
//         }

//         function chooseSize(Population) {
//             if (Population < 1500000) {
//                 return Population / 250000 
//             }
//             else return Population / 1000000;
//         };

//         function chooseColor(Population) {
//             switch(true) {
//                 case Population > 39283497:
//                     return "#F00505";
//                 case Population > 32803394:
//                     return "#FF2C05";
//                 case Population > 6480102:
//                     return "#FD6104";
//                 case Population > 5899078:
//                     return "#FD9A01";
//                 case Population > 581024:
//                     return "#FFCE03";
//                 default:
//                     return "#FEF001";
//                 }
//         }

//         let legend = L.control({
//             position: "bottomright"
//         });

//         legend.onAdd = function() {
//             let div = L.DomUtil.create("div", "legend");

//             let intensity = [0,"581,024","5,899,078","6,480,102","32,803,394","39,283,497"];
//             let colors = ["#FEF001", "#FFCE03", "#FD9A01", "#FD6104", "#FF2C05", "#F00505"];

//             let legendInfo = "<h4><u>LEGEND:</u></h4>"
//             div.innerHTML = legendInfo 
//             for (let i = 0; i < colors.length; i++) {
//                 div.innerHTML +=
//                 "<i style='background: " + colors[i] + "'></i> " +
//                 intensity[i] + (intensity[i + 1] ? " - " + intensity[i + 1] + " Population <br>" : "+ Population");
//             }
//             return div;

//         };
//         legend.addTo(myMap);
        
//         // DELETE OR COMMENT OUT BELOW ITEMS IF WE CANNOT GET THEM TO WORK //
        

     
//     });   
        
//     });
//     };

// function buildMapPrecip() {
//     fetch('/state')
//         .then(function (response) {
//             return response.json();
//         }).then(function (text) {
//         const data = text;
    
//         let map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         titleSize: 600,
//         maxZoom: 10,
//         zoomOffset: 0,
//         id: "mapbox/streets-v11",
//         accessToken: API_KEY
//         });

//         let myMap = L.map("map", {
//             center: [39.0997,-94.5786], //**KC, MO**//
//             zoom: 4,
//         });

//         map.addTo(myMap);

//         let geojson;
//         fetch('/master')
//         .then(function (response) {
//             return response.json();
//         }).then(function (text) {
//         var data2 = text;
//         let dict = {};
//         for (i = 0;49;i++) {
//             dict.push({
//             key:   data2.features[i].properties.state,
//             value: "4"
//             });
//         };
//         console.log("squid");
//         console.log(dict);
//         geojson = L.choropleth(data2, {
//                 // Define what  property in the features to use
//         valueProperty: "average rain",

//         // Set color scale
//         scale: ["white", "blue"],

//         // Number of breaks in step range
//         steps: 10,

//         // q for quartile, e for equidistant, k for k-means
//         mode: "q",
//         style: {
//         // Border color
//         color: "blue",
//         weight: 2,
//         fillOpacity: 0.8
//         },
//         }).addTo(myMap);
//             // let pop = feature.properties.Population;
//             // console.log(pop);
//         L.geoJson(data2, {
//             pointToLayer: function(feature, latlng) {
//                 return L.circleMarker(latlng);
//             },
//             style: chooseStyle,

//             onEachFeature: function(feature, layer) {
//                 layer.bindPopup("<div class=header><b><u>State Name</u></b>: " + feature.properties.state + "</div><b>Capital: </b>" + feature.properties.Capital + "<br> <b>State Population: </b>" + feature.properties.Population + "<br> <b>Median Age: </b>" + feature.properties["Median Age"] + "<br> <b>Household Income: </b>" + feature.properties["Household Income"] + "<br> <b>Poverty Count: </b>" + feature.properties["Poverty Count"] + "<br> <b>Poverty Rate %: </b>" + feature.properties["Poverty Rate"]);
//             }
//         }).addTo(myMap);

//         function chooseStyle(feature) {
//             return {
//                 opacity: 1,
//                 fillOpacity: 1,
//                 fillColor: chooseColor(feature.properties.Population),
//                 color: "black",
//                 radius: chooseSize(feature.properties.Population),
//                 stroke: true,
//                 weight: 2
//             };
//         }

//         function chooseSize(Population) {
//             if (Population < 1500000) {
//                 return Population / 250000 
//             }
//             else return Population / 1000000;
//         };

//         function chooseColor(Population) {
//             switch(true) {
//                 case Population > 39283497:
//                     return "#F00505";
//                 case Population > 32803394:
//                     return "#FF2C05";
//                 case Population > 6480102:
//                     return "#FD6104";
//                 case Population > 5899078:
//                     return "#FD9A01";
//                 case Population > 581024:
//                     return "#FFCE03";
//                 default:
//                     return "#FEF001";
//                 }
//         }

//         let legend = L.control({
//             position: "bottomright"
//         });

//         legend.onAdd = function() {
//             let div = L.DomUtil.create("div", "legend");

//             let intensity = [0,"581,024","5,899,078","6,480,102","32,803,394","39,283,497"];
//             let colors = ["#FEF001", "#FFCE03", "#FD9A01", "#FD6104", "#FF2C05", "#F00505"];

//             let legendInfo = "<h4><u>LEGEND:</u></h4>"
//             div.innerHTML = legendInfo 
//             for (let i = 0; i < colors.length; i++) {
//                 div.innerHTML +=
//                 "<i style='background: " + colors[i] + "'></i> " +
//                 intensity[i] + (intensity[i + 1] ? " - " + intensity[i + 1] + " Population <br>" : "+ Population");
//             }
//             return div;

//         };
//         legend.addTo(myMap);
        
//         // DELETE OR COMMENT OUT BELOW ITEMS IF WE CANNOT GET THEM TO WORK //
        

        
//     });   
        
//     });
//     };
//     buildMapPrecip();