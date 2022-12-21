from database import Tietokanta

tk = Tietokanta()


# pelaajan mukaan liitetyt ominaisuudet
class Pelaaja:
    def __init__(self, id, sijaintinimi="", kakkaa=False, aqi = 0, nimi=""):
        self.id = id
        self.nimi = nimi
        self.kakkaa = kakkaa
        self.aqi = aqi
        self.sijaintinimi = sijaintinimi
        # turha? koska id on autoincrementoitu, ottaa automaattisesti isoimman t. ilkka
        # self.kursori.execute("SELECT MAX(id) FROM peli")
        # self.id = self.kursori.fetchone()
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        if self.id == 0:
            kursori.execute(
                f"INSERT INTO peli (name, sijainti) VALUES ('{self.nimi}', '{self.sijaintinimi}')"
            )
            self.id = kursori.lastrowid
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
            if self.saakoKakkapisteita(self.aqi):
                kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
                sql = f"UPDATE peli SET kakatut_kentat = kakatut_kentat+1 WHERE id={self.id};"
                kursori.execute(sql)
            return True
        return False

    def kakka_check(self):
        kursori = tk.yhteys.cursor(dictionary=True, buffered=True)
        sql = f"SELECT * FROM goal_reached WHERE game_id = {self.id} AND airport_name = '{self.sijaintinimi}';"
        print("moro", sql)
        kursori.execute(sql)
        tulos = kursori.fetchall()
        print(tulos)
        if len(tulos) > 0:
            return False
        else:
            return True


    def saakoKakkapisteita(self, aqi):
        if aqi == 1 or aqi == 2:
            return True
        elif aqi == 3 or aqi == 4:
            return False
