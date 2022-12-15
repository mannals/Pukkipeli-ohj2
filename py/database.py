import mysql.connector
from dotenv import load_dotenv

load_dotenv()

class Tietokanta:
    def __init__(self):
        self.yhteys = mysql.connector.connect(
            host='localhost',
            port=3306,
            database='fl1ght_game',
            user='root',
            password='vaahtokarkki',
            autocommit=True
        )

    def ota_yhteys(self):
        return self.yhteys

    def nimea_pelaaja(self, nimi: str):
        #sql = "INSERT INTO peli VALUES ('"+ id +"'," + kakatut_kentat
        #alla olevaan sql koodiin muunnos +=, eikä tarvii insert into-lausetta
        sql = f'INSERT INTO peli(nimi) VALUES ("{nimi}");'
        kursori = self.yhteys.cursor()
        kursori.execute(sql)