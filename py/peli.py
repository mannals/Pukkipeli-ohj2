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






