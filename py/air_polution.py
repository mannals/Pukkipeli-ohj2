import requests
from airport import Lentokentta

lentsi = Lentokentta()
lentsikirja = lentsi.luo_lentokenttalista()

lat = lentsikirja['latitude']
lon = lentsikirja['longitude']

url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=d8d27e31da98f04894338ef22df6fec9'

vastaus = requests.get(url).json()


index = vastaus['list']['main']['aqi']

print(index)
