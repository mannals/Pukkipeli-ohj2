from database import Tietokanta
import requests

lentopeli = Tietokanta()
yhteys = lentopeli.ota_yhteys()

class Lentokentta:
    def __init__(self, nimi="nimeton", lat=0, long=0, lentokenttadata={}):
        self.nimi = nimi
        self.lat = lat
        self.long = long
        self.lentokenttadata = lentokenttadata

    def luo_lentokenttalista(self):
        sql = 'SELECT name, latitude_deg, longitude_deg FROM airport;'
        kursori = yhteys.cursor()
        kursori.execute(sql)
        tulos = kursori.fetchall()

        isompi_lentsikirja = {}

        for kentta in tulos:
            lentsikirja = {}
            lentsikirja['latitude'] = float(kentta[1])
            lentsikirja['longitude'] = float(kentta[2])
            isompi_lentsikirja[kentta[0]] = lentsikirja

        self.lentokenttadata = isompi_lentsikirja

#haetaan indeksi arvo apista ja lisätään lentokantaan
    def lentsi_ja_indeksi(self):

        for lentsi in self.lentokenttadata:
            lat = self.lentokenttadata[lentsi]['latitude']
            lon = self.lentokenttadata[lentsi]['longitude']

            url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=9c9465c1b58d94ccd7685d5b09ab66b4'

            vastaus = requests.get(url).json()

            indeksi = int(vastaus['list'][0]['main']['aqi'])

            self.lentokenttadata[lentsi]['air pollution index'] = indeksi

            sql = f'UPDATE airport SET air_pollution = {indeksi} WHERE name = "{lentsi}";'
            kursori = yhteys.cursor()
            kursori.execute(sql)


