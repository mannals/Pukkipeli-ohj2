from airport import Lentokentta
import json
from flask import Flask, Response

lentsi = Lentokentta()
lista = lentsi.luo_lentokenttalista()

app = Flask(__name__)
@app.route('/lentokentat')
def tuo(lista):
    try:
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

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)