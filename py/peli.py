from database import Tietokanta
import time
tk = Tietokanta()
import plotly.graph_objects as go

# pelaajan mukaan liitetyt ominaisuudet
class Pelaaja:
    def __init__(self, id, sijaintinimi="", kakkaa=False, aqi = 0, nimi="", highscore= 0, jakomaara = 0):
        self.id = id
        self.sijaintinimi = sijaintinimi
        self.nimi = nimi
        self.kakkaa = kakkaa
        self.aqi = aqi
        self.highscore = highscore
        self.jakomaara = jakomaara
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        # jos pelaaja on uusi
        if self.id == 0:
            kursori.execute(
                f"INSERT INTO peli (name, sijainti) VALUES ('{self.nimi}', '{self.sijaintinimi}')"
            )
            self.id = kursori.lastrowid
        # jos pelaajan id on olemassa, päivitetään pelaajan sijainti
        else:
            if self.sijaintinimi !="":
                kursori.execute(
                    f"UPDATE peli SET sijainti = '{self.sijaintinimi}' WHERE id={self.id}"
                )
        if self.kakkaa:
            tiedot = self.pelitiedot()
            self.sijaintinimi = tiedot['sijainti']
            self.kakka_confirmed()

    def pelitiedot(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT * from peli WHERE id = {self.id};"
        kursori.execute(sql)
        tulos = kursori.fetchone()
        print(tulos)
        return tulos


    def kakka_confirmed(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        if self.kakka_check():
            sql = f"INSERT INTO goal_reached (game_id, airport_name) VALUES ({self.id}, '{self.sijaintinimi}');"
            kursori.execute(sql)
            saakopisteita = self.saakoKakkapisteita(self.aqi)
            if saakopisteita:
                kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
                sql = f"UPDATE peli SET kakatut_kentat = kakatut_kentat+1 WHERE id={self.id};"
                sql2 = f"UPDATE peli SET highscore = highscore+1 WHERE id={self.id};"
                kursori.execute(sql)
                kursori.execute(sql2)
            return True
        return False

    # Tsekkaa, onko jo kakattu kentälle (ettei voi uudestaan kakata)
    def kakka_check(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT * FROM goal_reached WHERE game_id = {self.id} AND airport_name = '{self.sijaintinimi}';"
        kursori.execute(sql)
        tulos = kursori.fetchall()
        if len(tulos) > 0:
            return False
        else:
            return True

    # kakkapisteet ilmaindeksin mukaan
    def saakoKakkapisteita(self, aqi):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT air_pollution FROM airport WHERE name = '{self.sijaintinimi}';"
        kursori.execute(sql)
        tulos = kursori.fetchone()
        aqiArvo = int(tulos['air_pollution'])
        if aqiArvo == 1 or aqiArvo == 2:
            self.jakomaara += 1
            return True
        elif aqiArvo == 3 or aqiArvo == 4 or aqiArvo == 5:
            return False

    def findPlayer(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = '''SELECT name FROM peli;'''
        kursori.execute(sql)
        tulos = [i[0] for i in kursori.fetchall()]
        return tulos

    def findHighscore(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT MAX(kakatut_kentat) FROM peli WHERE name = '{self.nimi}';"
        kursori.execute(sql)
        tulos = [i[0] for i in kursori.fetchall()]
        return tulos

