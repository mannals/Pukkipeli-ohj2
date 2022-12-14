from database import Tietokanta

tk = Tietokanta()

class Pelaaja:
    def __init__(self, nimi, lat, lng, sijaintinimi, kakat=0, lahjat=0):
        self.kursori = tk.yhteys.cursor()
        self.nimi = nimi
        self.kakat = kakat
        self.lahjat = lahjat
        self.lat = lat
        self.lng = lng
        self.sijaintinimi = sijaintinimi

        self.kursori.execute(
            f"INSERT INTO peli(nimi, latitude, longitude, sijaintinimi) VALUES ({self.nimi}, {self.lat}, {self.lng}, {self.sijaintinimi})"
        )

    def kakkasijainnin_nimi(self, lat, lng):
        self.lat = float(lat)
        self.lng = float(lng)

        sql = f"SELECT name FROM airport WHERE latitude_deg = {self.lat} AND longitude_deg = {self.lng};"
        self.kursori.execute(sql)
        tulos = self.kursori.fetchone()

        if tulos.rowcount > 0:
            jtulos = {
                'paikan_nimi': tulos[0]
            }

        else:
            jtulos = {
                "viesti": "Virheellinen yhteenlaskettava",
                "status": 400
            }

        return jtulos

    def game_id(self, nimi):
        self.kursori.execute(f"SELECT id FROM peli WHERE name={nimi}")
        tulos = self.kursori.fetchone()






