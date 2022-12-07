from database import Tietokanta

lentopeli = Tietokanta()

yhteys = lentopeli.ota_yhteys()

class Lentokentta:
    def __init__(self, nimi="nimeton", lat=0, long=0):
        self.nimi = nimi
        self.lat = lat
        self.long = long

    def luo_lentokenttalista(self):
        sql = 'SELECT name, latitude_deg, longitude_deg FROM airport;'
        kursori = yhteys.cursor()
        kursori.execute(sql)
        tulos = kursori.fetchall()

        # tehdään lista, jossa on vain lentokenttien nimet niin että ne ei ole osana tuplea (ei tule sulkuja ympärille)
        isompi_lentsikirja = {}

        for kentta in tulos:
            lentsikirja = {}
            lentsikirja['latitude'] = float(kentta[1])
            lentsikirja['longitude'] = float(kentta[2])
            isompi_lentsikirja[kentta[0]] = lentsikirja


        return isompi_lentsikirja
