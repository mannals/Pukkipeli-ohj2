import mysql.connector
from dotenv import load_dotenv

load_dotenv()


class Tietokanta:
    def __init__(self):
        self.yhteys = mysql.connector.connect(
            host='localhost',
            port=3306,
            database='lentopeli',
            user='root',
            password='MiksiRikoit56Lamppua?',
            autocommit=True
        )

    def ota_yhteys(self):
        return self.yhteys