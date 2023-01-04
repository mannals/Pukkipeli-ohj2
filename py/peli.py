from database import Tietokanta
import time
tk = Tietokanta()

# pelaajan mukaan liitetyt ominaisuudet
class Pelaaja:
    def __init__(self, id, sijaintinimi="", kakkaa=False, lahja=False, aqi = 0, nimi="", jakomaara = 0):
        self.id = id
        self.nimi = nimi
        self.kakkaa = kakkaa
        self.lahja = lahja
        self.aqi = aqi
        self.sijaintinimi = sijaintinimi
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

        if self.lahja:
            tiedot= self.pelitiedot()
            self.sijaintinimi = tiedot['sijainti']
            self.lahja_confirmed()

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
                kursori.execute(sql)
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

    # Ylempi funktio tarkemmin?
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

#lahja osio
    def lahja_confirmed(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        if self.lahja_check():
            sql = f"INSERT INTO goal_reached (game_id, airport_name) VALUES ({self.id}, '{self.sijaintinimi}');"
            kursori.execute(sql)
            saakopisteita = self.saakoLahjapisteita(self.aqi)
            if saakopisteita:
                kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
                sql = f"UPDATE peli SET lahjat_annettu = lahjat_annettu+1 WHERE id={self.id};"
                kursori.execute(sql)
            return True
        return False

    # Tsekkaa, onko jo lahja kentälle (ettei voi uudestaan lahjaa)
    def lahja_check(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT * FROM goal_reached WHERE game_id = {self.id} AND airport_name = '{self.sijaintinimi}';"
        kursori.execute(sql)
        tulos = kursori.fetchall()
        if len(tulos) > 0:
            return False
        else:
            return True

    # Onnistuuko kakkaus
    def saakoLahjapisteita(self, aqi):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT air_pollution FROM airport WHERE name = '{self.sijaintinimi}';"
        kursori.execute(sql)
        tulos = kursori.fetchone()
        aqiArvo = int(tulos['air_pollution'])
        if aqiArvo == 1 or aqiArvo == 2:
            self.jakomaara -= 1
            return False
        elif aqiArvo == 3 or aqiArvo == 4 or aqiArvo == 5:
            self.jakomaara -= 1
            return True


