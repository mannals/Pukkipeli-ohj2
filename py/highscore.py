# highscore taulukko

import plotly.graph_objects as go
import plotly.offline as po
import mysql.connector

sivu = 'C:/Users/OMISTAJA/OneDrive/Tiedostot/GitHub/Pukkipeli-ohj2/top_pisteet.html'

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
print(type(fig))

divi = po.plot(fig, include_plotlyjs=False, output_type='div')

with open(sivu, 'w') as taulukko:
    taulukko.write(f'<!DOCTYPE html><html><head><script src="https://cdn.plot.ly/plotly-latest.min.js"></script></head><body>{divi}</body></html>')

