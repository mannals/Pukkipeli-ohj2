from airport import Lentokentta
import json
import requests

lentsi = Lentokentta()
lentsikirja = lentsi.luo_lentokenttalista()

lentsikirjaString = json.dumps(lentsikirja)
lentsikirjaParse = json.loads(lentsikirjaString)

for values in lentsikirjaParse.values():
    lat = values['latitude']
    lon = values['longitude']
    url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=df2f23555b8bb70eff10e105302daa5f'
    vastaus = requests.get(url).json()
    index = vastaus['list'][0]['main']['aqi']
    print(index)

