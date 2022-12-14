from airport import Lentokentta
import peli

import json
from flask import Flask, Response, request
from flask_cors import CORS
from dotenv import load_dotenv
from database import Tietokanta


load_dotenv()

lentopeli = Tietokanta()
yhteys = lentopeli.ota_yhteys()

lentsi = Lentokentta()
lentsi.luo_lentokenttalista()
lentsi.lentsi_ja_indeksi()
lentsit = lentsi.lentokenttadata


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/lentokentat/<lista>')
def lentokentat(lista):
    try:
        global lentsit
        lista = lentsit
        lista_json = json.dumps(lista)
        return lista_json
    except ValueError:
        vastaus = {
            "viesti": "Ei löytynyt lentokenttä-jsonia!",
            "status": 404
        }
        json_vastaus = json.dumps(vastaus)
        http_vastaus = Response(response=json_vastaus, status=404, mimetype="application/json")
        return http_vastaus

@app.route('/porospeksit')
def porospeksit():
    args = request.args
    pelaaja = args.get("pelaaja")
    lat = args.get("lat")
    lng = args.get("lng")
    loc = args.get("sijainti")
    # json_data = {"pelaaja": pelaaja, "latitude": lat, "longitude": lng, "sijainti": loc}
    json_data = peli.Pelaaja(pelaaja, lat, lng, loc)
    return json_data

@app.route('/kakkaus')
def kakkaus():
    args = request.args
    id = args.get("id")
    lat = args.get("latitude")
    lng = args.get("longitude")
    onkokakka = peli.kakka_check(id, lat, lng)
    if onkokakka == 0:
        kakkaa = peli.kakka_confirmed(id, lat, lng)
    else:
        print("Ei voi kakata")


    json_data = {"id": id, "latitude": lat, "longitude": lng}
    return json_data



if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

