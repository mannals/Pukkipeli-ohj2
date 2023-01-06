# highscore taulukko

import chart_studio.plotly as py
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
    password='MiksiRikoit56Lamppua?',
    autocommit=True
    )

def tuo_pistedata():
    kursori = yhteys.cursor(dictionary=True, buffered=True)
    sql = f"SELECT name, highscore FROM peli;"
    kursori.execute(sql)
    tulos = kursori.fetchall()
    print(tulos)
    return tulos

def nimet():
    nimilista = []
    tietolista = tuo_pistedata()
    for i in range(5):
        nimilista.append(tietolista[i]['name'])
    return nimilista

def pistemaarat():
    pistelista = []
    tietolista = tuo_pistedata()
    for i in range(5):
        pistelista.append(tietolista[i]['highscore'])
    return pistelista


fig = go.Figure(data=[go.Table(header=dict(values=['Player', 'Highscore']),
                 cells=dict(values=[nimet(), pistemaarat()]))
                     ])
fig.show()

fig.write_html("C:/Users/OMISTAJA/OneDrive/Tiedostot/GitHub/Pukkipeli-ohj2/highscore.html")