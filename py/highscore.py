# highscore taulukko

import plotly.graph_objects as go
import mysql.connector

from peli import Pelaaja

playerValues = []
highscoreValues = []

yhteys = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='fl1ght_game',
    user='root',
    password='vaahtokarkki',
    autocommit=True
    )

def findPlayer():
    sql = '''SELECT name FROM peli;'''
    kursori = yhteys.cursor()
    kursori.execute(sql)
    tulos = [i[0] for i in kursori.fetchall()]
    return tulos

def findHighscore():
    sql = f'''SELECT MAX(kakatut_kentat) FROM peli WHERE name = '{Pelaaja.nimi}';'''
    kursori = yhteys.cursor()
    kursori.execute(sql)
    tulos = [i[0] for i in kursori.fetchall()]
    return tulos


print(findPlayer())
print(findHighscore())

fig = go.Figure(data=[go.Table(header=dict(values=['Player', 'Highscore']),
                 cells=dict(values=[findPlayer(), findHighscore()]))
                     ])
fig.show()

fig.write_html("C:/Users/peppi/OneDrive/Documents/GitHub/Pukkipeli-ohj2/highscore.html")