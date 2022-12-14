from database import Tietokanta

tk = Tietokanta()
kursori = tk.yhteys.cursor()

class Pelaaja:
    def __init__(self, nimi, lat, lng, sijaintinimi, kakat=0, lahjat=0):
        self.kursori = tk.yhteys.cursor()
        self.nimi = nimi
        self.kakat = kakat
        self.lahjat = lahjat
        self.lat = lat
        self.lng = lng
        self.sijaintinimi = sijaintinimi

        self.kursori.execute("SELECT MAX(id) FROM peli")
        self.id = self.kursori.fetchone()

        self.kursori.execute(
            f"INSERT INTO peli(nimi, latitude, longitude, sijainti) VALUES ({self.nimi}, {self.lat}, {self.lng}, {self.sijaintinimi})"
        )
        return self



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





def kakka_confirmed(id, lat, lng):
    sql = f"UPDATE airport SET onko_kakka = 1 WHERE latitude_deg = {lat} AND longitude_deg = {lng};"
    kursori.execute(sql)

def kakka_check(id, lat, lng):
    sql = f"SELECT onko_kakka FROM airport WHERE latitude_deg = {lat} AND longitude_deg = {lng};"
    kursori.execute(sql)
    tulos = kursori.fetchone()

    return tulos[0]

def saakoKakkapisteita(id, lat, lng):
    sql = f"SELECT air_pollution FROM airport WHERE latitude_deg = {lat} AND longitude_deg = {lng};"
    kursori.execute(sql)
    tulos = kursori.fetchone()

    if tulos[0] == 1 or tulos[0] == 2:
        jtulos = {
            "saakoKakkapisteita": True
        }
        return jtulos
    elif tulos[0] == 3 or tulos[0] == 4:
        jtulos = {
            "saakoKakkapisteita": False
        }
        return jtulos
