import pandas as pd
import yfinance as yf
from datetime import date
from dateutil.relativedelta import relativedelta

today = date.today()
five_years = today - relativedelta(years=+5)

ticker_file = "../app/data/tickers.csv"
tickers = pd.read_csv(ticker_file, header=None)

print(tickers)
choice = input("Choose a stock ticker from the above list: ")


data = yf.download(choice, start=five_years, end=today)
print(data)