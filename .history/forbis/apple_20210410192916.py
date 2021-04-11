import pandas as pd
import yfinance as yf
from datetime import date
from dateutil.relativedelta import relativedelta

today = date.today()
five_years = today - relativedelta(years=+5)

apple = yf.download("AAPL", start=five_years, end=today)
apple