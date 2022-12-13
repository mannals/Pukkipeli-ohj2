from database import Tietokanta

#yritys
from flask import Flask
from flask import request
#yritys

lentopeli = Tietokanta()
yhteys = lentopeli.ota_yhteys()

#alkuperäiset funktiot


def nimea_pelaaja(nimi: str):
    #if lauseen lisäys ja nimi funktion lisäys
    if request.method == 'POST':
        nimi = request.form['name']
        sql = f'INSERT INTO peli(name) VALUES ("{nimi}");'
        kursori = yhteys.cursor()
        kursori.execute(sql)



def paivita_kakka():
    global kakatut_kakat, pelaajan_nimi
    sql = f'UPDATE peli SET kakatut_kentat = {kakatut_kakat} WHERE name = "{pelaajan_nimi}";'
    kursori = yhteys.cursor()
    kursori.execute(sql)


def paivita_lahjat():
    global lasten_saamat_lahjat, pelaajan_nimi
    sql = f'UPDATE peli SET lahjat_annettu = {lasten_saamat_lahjat} WHERE name = "{pelaajan_nimi}";'
    kursori = yhteys.cursor()
    kursori.execute(sql)


def paivita_highscore():
    global pelaajan_nimi, lasten_saamat_lahjat

    tahanastinen = f'SELECT highscore FROM peli WHERE name = "{pelaajan_nimi}";'
    kursori = yhteys.cursor()
    kursori.execute(tahanastinen)
    paras_tahanasti = kursori.fetchone()[0]
    if lasten_saamat_lahjat > paras_tahanasti:
        paivita_hs = f'UPDATE peli SET highscore = {lasten_saamat_lahjat} WHERE name = "{pelaajan_nimi}";'
        kursori2 = yhteys.cursor()
        kursori2.execute(paivita_hs)


def tulosta_highscore():
    sql = f'SELECT name, lahjat_annettu FROM peli WHERE lahjat_annettu = (SELECT MAX(lahjat_annettu) FROM peli);'
    kursori = yhteys.cursor()
    kursori.execute(sql)
    maximi = kursori.fetchall()
    return maximi