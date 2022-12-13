import requests
from airport import Lentokentta
from flask import jsonify


lentsi = Lentokentta()
lentsikirja = lentsi.luo_lentokenttalista()
print(lentsikirja)


class Ilmansaasteet:

    def __init__(self, lentokenttadata):
        self.lentokenttadata = lentokenttadata
    def lentsi_ja_indeksi(self):
        indeksikirjasto = {}
        for lentsi in self.lentokenttadata:
            lat = self.lentokenttadata[lentsi]['latitude']
            lon = self.lentokenttadata[lentsi]['longitude']

            url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=1eaca74789ff332a01d1c16c5e890e3f'

            vastaus = requests.get(url).json()
            print(vastaus)

            index = vastaus['list'][0]['main']['aqi']

            indeksikirjasto[lentsi] = index

        return indeksikirjasto


saastedata = Ilmansaasteet(lentsikirja)
lentsit_indeksit = saastedata.lentsi_ja_indeksi()



