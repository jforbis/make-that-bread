from flask import Flask, render_template, redirect, jsonify, request
from StockData import get_tickers
from pprint import pprint
import json
import ast
import yfinance as yf
import datetime as dt


app = Flask(__name__)

data, tickers = get_tickers()

@app.route("/", methods=['GET'])
def home():
    tick = tickers[-1]
    name = yf.Ticker(tick).info['longName']
    return render_template("index.html", tickers = tickers, name = name)

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


if __name__ == "__main__":
    app.run(debug=True)


