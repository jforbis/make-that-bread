import matplotlib.pyplot as plt
import requests
import json
from scipy import stats
import pandas as pd
from pprint import pprint
import yfinance as yf
from datetime import date
from dateutil.relativedelta import relativedelta
import io

def get_tickers():
    url = "https://www.tradingview.com/markets/stocks-usa/market-movers-most-volatile/"

    df = pd.read_html(url)
    df1 = pd.DataFrame(df[0])
    ticker_list = list(df1["Unnamed: 0"])

    ticker_list = ticker_list[0:24]
    ticker_dict = {}

    for i in ticker_list:
        try:
            data_list = i.split("  ", 2)
            tick = data_list[1]
            name = data_list[2]
            ticker_dict[tick]= name
        except:
            pass

    df2 = pd.DataFrame.from_dict(ticker_dict, orient='index',columns=['Name'])
    df2.reset_index(inplace=True)
    df2 = df2.rename(columns = {'index':'Ticker'})

    companies = list(df2["Ticker"])
    tickerdf = yf.download(tickers = companies,period = '2y',group_by = 'ticker',auto_adjust = True)
    print (companies)
    return tickerdf, companies