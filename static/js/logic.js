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

function buildStockPredict() {
    document.getElementById("butt").innerHTML = " "
    document.getElementById("butt").innerHTML = '<button class="btn btn-primary" type="button" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...</button>'

    let ticker = d3.select("#selDataset").node().value;
    let date1 = d3.select("#date").node().value;
    let stuff = {"ticker":ticker,"date":date1}
    fetch('/get_data3', {
        method: 'POST',
        body: JSON.stringify(stuff)
    })
        .then(function (response) {
            return response.json();
        }).then(function (text) {
            let price = text[0];
            let mae = text[1];
            let as = text[2];
            console.log(text);

            document.getElementById("FP").innerHTML = "<b>Future Price: <br></b> $" + price;
            document.getElementById("MAE").innerHTML = "<b><a style='color: black;' target=new href='https://en.wikipedia.org/wiki/Mean_absolute_error'>Mean Absolute Error(mae): </a><br></b> " + mae + "</a>%";
            document.getElementById("AS").innerHTML = "<b>Accuracy Score: <br></b> " + as + "%";
            document.getElementById("butt").innerHTML = " "
            document.getElementById("butt").innerHTML = '<button class="btn btn-primary" name="submit" type="submit" onclick="buildStockPredict()">Submit</button>'
        })
    } 


function buildStockGraph() {
    let ticker = d3.select("#selDataset").node().value;
    document.getElementById("FP").innerHTML = " ";
    document.getElementById("MAE").innerHTML = " ";
    document.getElementById("AS").innerHTML = " ";
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

            document.getElementById("compname").innerHTML = "<b>Company: <br></b><i> " + name['longName'] + "</i>";
            document.getElementById("high").innerHTML = "<b>High: </b> " + high;
            document.getElementById("low").innerHTML = "<b>Low: </b> " + low;
            document.getElementById("open").innerHTML = "<b>Open: </b> " + open;
            document.getElementById("close").innerHTML = "<b>Close: </b> " + close;
            document.getElementById("volume").innerHTML = "<b>Volume: </b> " + volume;
            document.getElementById("url").innerHTML = "<a style='color: white;' target=blank href =" + name["website"] + ">Learn about the company!</a>"
            document.getElementById("logo").innerHTML = "<img class='card-img-top' src=" + stock_logo + " alt='Company Logo' style='max-width: 128px; padding: 5px;'></img>"
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
            yaxis: { title: "Price ($)" },
            plot_bgcolor: "rgb(218, 218, 218)",
            paper_bgcolor: "rgb(218, 218, 218)",
            };

            let layout2 = {
                title: "'" + ticker + "'" + " Candle Chart",
                xaxis: { title: "Date",
                         type: "date" },
                yaxis: { title: "Price ($)" },
                plot_bgcolor: "rgb(218, 218, 218)",
                paper_bgcolor: "rgb(218, 218, 218)",
                };
        
            Plotly.newPlot("line", graphdata, layout);
            Plotly.newPlot("candle", graphdata2, layout2);
        })
    })
    };

buildStockGraph();