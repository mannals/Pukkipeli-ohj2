from airport import Lentokentta
from database import Tietokanta
import json
import requests

lentopeli = Tietokanta()
yhteys = lentopeli.ota_yhteys()

lentsi = Lentokentta()
lentsikirja = lentsi.luo_lentokenttalista()

lentsikirjaString = json.dumps(lentsikirja)
lentsikirjaParse = json.loads(lentsikirjaString)

for values in lentsikirjaParse.values():
    lat = values['latitude']
    lon = values['longitude']
    url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=df2f23555b8bb70eff10e105302daa5f'
    vastaus = requests.get(url).json()
    index = int(vastaus['list'][0]['main']['aqi'])

    def luo_aqi_index():
        sql = f'UPDATE airport SET air_pollution = {index} WHERE latitude_deg = {lat} AND longitude_deg = {lon};'
        kursori = yhteys.cursor()
        kursori.execute(sql)