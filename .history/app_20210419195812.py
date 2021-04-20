from flask import Flask, render_template, redirect, jsonify, request
from StockData import get_tickers
from predict_2 import make_prediction
from pprint import pprint
import json
import ast
import yfinance as yf
import datetime as dt
from datetime import date
from datetime import datetime

app = Flask(__name__)

data, tickers = get_tickers()

@app.route("/", methods=['GET'])
def home():
    return render_template("index.html", tickers = tickers)

@app.route('/get_data', methods=['GET', 'POST'])
def testfn():
    if request.method == 'POST':
        results = ast.literal_eval(request.data.decode('utf-8'))
        print (results)
        dataset = data[results]
        dataset = dataset.reset_index(drop=False)
        dataset['Date'] = dataset['Date'].dt.strftime('%Y-%m-%d')
        dataset = dataset.dropna()
        return dataset.to_json(orient='records')
        
@app.route('/get_data2', methods=['GET', 'POST'])
def testfn2():
    if request.method == 'POST':
        results = ast.literal_eval(request.data.decode('utf-8'))
        name = yf.Ticker(results).info
        return json.dumps(name)

@app.route('/get_data3', methods=['GET', 'POST'])
def testfn3():
    if request.method == 'POST':
        results = ast.literal_eval(request.data.decode('utf-8'))
        date1 = datetime.strptime(results['date'], '%m/%d/%Y')
        ticker = results['ticker']
        today = date.today()
        today = today.strftime("%m/%d/%Y")
        today = datetime.strptime(today, '%m/%d/%Y')
        # today = int((str(today).split("-",2))[2])
        # date1 = int((date1.split("/",2))[1])
        days = (date1 - today).days
        dataset = make_prediction(tick=ticker, days=days)
        return json.dumps(dataset)


if __name__ == "__main__":
    app.run(debug=True)


