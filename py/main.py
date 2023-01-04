from airport import Lentokentta
from peli import Pelaaja
import peli

import json
from flask import Flask, Response, request
from flask_cors import CORS
from dotenv import load_dotenv
from database import Tietokanta


load_dotenv()

lentopeli = Tietokanta()
yhteys = lentopeli.ota_yhteys()


#hidastaa käynnistystä?



app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#luodaan flask-kirjastoa muuttujista, joita voidaan käyttää pelin pääkoodissa
@app.route('/lentokentat')
def lentokentat():
    try:
        lentsi = Lentokentta()
        lentsi.luo_lentokenttalista()
        lentsi.lentsi_ja_indeksi()
        lentsit = lentsi.lentokenttadata
        lista_json = json.dumps(lentsit)
        return lista_json
    except ValueError:
        vastaus = {
            "viesti": "Ei löytynyt lentokenttä-jsonia!",
            "status": 404
        }
        json_vastaus = json.dumps(vastaus)
        http_vastaus = Response(response=json_vastaus, status=404, mimetype="application/json")
        return http_vastaus

#tarvitaan, että voidaan määritellä pelaajan ominaisuudet ui.js
@app.route('/porospeksit')
def porospeksit():
    #aloitapeli-muuttuja
    args = request.args
    playerr = args.get("pelaaja")
    loc = args.get("sijainti")
    # json_data = {"pelaaja": pelaaja, "latitude": lat, "longitude": lng, "sijainti": loc}
    peliinfot = Pelaaja(0, loc, False, False, 0, playerr)

    json_data = peliinfot.pelitiedot()
    print(json_data)
    return json.dumps(json_data)


@app.route('/liikkuminen')
def liikkuminen():
    args = request.args
    peli_id = args.get("peli_id")
    loc = args.get("kohde")
    # json_data = {"pelaaja": pelaaja, "latitude": lat, "longitude": lng, "sijainti": loc}
    peliinfot = Pelaaja(peli_id, loc)

    json_data = peliinfot.pelitiedot()
    print(json_data)
    return json.dumps(json_data)


@app.route('/kakkaus')
def kakkaus():
    args = request.args
    peli_id = args.get("id")
    aqi = args.get("aqi")
    peliinfot = Pelaaja(peli_id, "", True, False, aqi)
    json_data = peliinfot.pelitiedot()
    return json_data

@app.route('/lahjaus')
def lahjaus():
    args = request.args
    peli_id = args.get("id")
    aqi = args.get("aqi")
    peliinfot = Pelaaja(peli_id, "", False, True, aqi)
    json_data = peliinfot.pelitiedot()
    return json_data

@app.route('/jakomaara')
def jakomaara():
    args = request.args
    peli_id = args.get("id")
    peliinfot = Pelaaja(peli_id, "", False, False, jakomaara)
    json_data = peliinfot.pelitiedot()
    return json_data

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

