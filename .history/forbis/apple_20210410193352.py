import pandas as pd
import yfinance as yf
from datetime import date
from dateutil.relativedelta import relativedelta

today = date.today()
five_years = today - relativedelta(years=+5)

choice = input("Enter your stock ticker")


data = yf.download(choice, start=five_years, end=today)
print(data)