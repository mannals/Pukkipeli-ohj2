'use strict';
//leafletiin perustuvaa kartan luontia
const map = L.map('map').setView([55.97, 12.83], 4);

let poroLat = 66.56167;
let poroLng = 25.83083;
let sijainti = "Rovaniemi Airport";
let globalid;
let aqi = 0;
const poroIkoni = L.icon({
    iconUrl: 'img/pukkiporo.png',

    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
});
const poroOptions = {
    title: "Pukkiporomarkkeri",
    clickable: true,
    draggable: false,
    icon: poroIkoni,
    riseOnHover: true,
    riseOffset: 250,
    zIndexOffset: 1000,
    optimized: false,
}

let aikaa_jaljella = document.querySelector("#aikaa-jaljella"),
         	 secondsLeft = 30


//kenttämerkit ja aloitus "Aloita peli"-napin tapahtumat nimen annon jälkeen
let airportMarkers;
const aloitaPeli = document.querySelector('#sendStart');
aloitaPeli.addEventListener('click', async () => {
    const pelaajanNimi = document.querySelector('#pelaajanNimi').value;
    const aloitusSpeksit = await fetch(
        `http://127.0.0.1:3000/porospeksit?pelaaja=${pelaajanNimi}&sijainti=${sijainti}`
    )
    //luodaan tiedot-muuttuja, missä json-tiedostona lähtötilanne
    const tiedot = await aloitusSpeksit.json()
    // sain ajastimen näkyy ja toimii jeeeeee t. anna
    const downloadTimer = setInterval(
    () => {
        if (secondsLeft <= 0) clearInterval(downloadTimer)
        aikaa_jaljella.value = secondsLeft
        aikaa_jaljella.textContent = secondsLeft
        secondsLeft -= 1
    },
1000)
    globalid = tiedot.id
})

//pelikentän luonti, missä kentästä tehdään ei raahattava(?) ja zoomauksen maksimi on määrätty(?)
var layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    draggable: false
});

//lisätään itse html:ään kartta/pelikenttä
map.addLayer(layer);

let globaltiedot;

//hyvä loppu
function kaikki_loppuuHYVIN() {
    HyvaLoppuDialog.showModal();
}
const HyvaLoppuDialog = document.getElementById('HyvaLoppuModal')
// dialogin sulkeminen
const SuljeHyvaLoppuDialog = document.getElementById('HyvaRestart')
SuljeHyvaLoppuDialog.addEventListener('click', () => {
    HyvaLoppuDialog.close();
})

//huono loppu
function kaikki_loppuuHUONOSTI() {
    HuonoLoppuDialog.showModal();
}
const HuonoLoppuDialog = document.getElementById('HuonoLoppuModal')
// dialogin sulkeminen
const SuljeHuonoLoppuDialog = document.getElementById('HuonoRestart')
SuljeHuonoLoppuDialog.addEventListener('click', () => {
    HuonoLoppuDialog.close();
})

//vaihe vaihtuu
function vaihda_vaihe() {
    VaihaVaihdeDialog.showModal();
}

let VaihaVaihdeDialog = document.getElementById('VaiheVaihtuu')
const SuljeVVDialog = document.getElementById('ok')
SuljeVVDialog.addEventListener('click', () => {
    VaihaVaihdeDialog.close();
})


async function jakomaara() {
    let kakkamaara = await fetch(`http://127.0.0.1:3000/jakomaara?id=${globalid}`)
    const tiedot = await kakkamaara.json()
    console.log('toinen vaihe alkaa')
    globaltiedot = tiedot['kakatut_kentat']
    document.querySelector('#kakkaMaara').innerHTML=globaltiedot;
    let saatuPaska = document.querySelector('#kakkaMaara').innerHTML;
    console.log(saatuPaska);
    vaihda_vaihe();
    if (saatuPaska >= 10) {
        kaikki_loppuuHYVIN();
    } else {
        kaikki_loppuuHUONOSTI();
    }
}

//luodaan kakkanäppäin, joka ei returnaa mitään arvoa (void), sis. css muotoilun
var kakkanappain = L.Control.extend({
    options: {
        position: 'topright'
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('button');
        container.type = "button";
        container.innerHTML = '<img src="img/poop.png" height="80%" width="80%";>'
        container.style.width = '64px';
        container.style.height = '64px';
        container.style.alignContent = 'center';
        container.style.border = '#88a9b2 2px solid';
        container.style.borderRadius = '2em';

        container.style.margin = '10px';
        container.style.alignContent = 'center';
        container.style.cursor = 'pointer';

        container.onclick = function () {

            if (document.querySelector('#aikaa-jaljella').innerHTML === "0") {
                container.disabled = true;
                jakomaara();
                let saatuPaska = document.querySelector('#kakkaMaara').innerHTML;
                console.log(saatuPaska);
            } else {
                container.disabled = false;
                kakkaa(globalid, poroLat, poroLng);
            }
        }
        return container;
    },

});

var lahjanappain = L.Control.extend({
    options: {
        position: 'topright'
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },

    onAdd: function (map) {
        var containerL = L.DomUtil.create('button');
        containerL.type = "button";
        containerL.innerHTML = '<img src="img/gift.png" height="80%" width="80%";>'
        containerL.style.width = '64px';
        containerL.style.height = '64px';
        containerL.style.alignContent = 'center';
        containerL.style.border = '#88a9b2 2px solid';
        containerL.style.borderRadius = '2em';

        containerL.style.margin = '10px';
        containerL.style.alignContent = 'center';
        containerL.style.cursor = 'pointer';
        containerL.disabled = false;

        containerL.onclick = function () {
            if (document.querySelector('#aikaa-jaljella').innerHTML === "0") {
                anna_lahja(globalid, poroLat, poroLng);

                //let lahja_maara = jakomaara()
                //console.log(lahja_maara)
                //lahja_maara -= 1
               // if (lahja_maara === 0) {
                //    kaikki_loppuu()
               // }
            }
        }

        return containerL;
    },

});


//lisätään leaflet karttaan kakkanäppäin
map.addControl(new kakkanappain());
map.addControl(new lahjanappain());

//noudetaan lentokenttä lista
async function noudaLentsidata() {
    console.log('Noudetaan lentokenttädataa');
    try {
        const noukittava = await fetch('http://127.0.0.1:3000/lentokentat');
        if (!noukittava.ok) throw new Error('Invalid server input!');
        return await noukittava.json();
    } catch (error) {
        console.log(error.message);
    } finally {
        console.log('asynchronous load complete');
    }
}

//funktio, jolla poroikonin saa siirrettyä lentokentältä toiselle (jotka löytyy lentokenttä listalta(ylempi funktio))
async function tuoKarttaan(poro) {
    let lentsiJson = await noudaLentsidata();
    let markerList = [];
    let markerOptions = {
        title: "Lentokenttamarkkeri",
        clickable: true,
        draggable: false
    }

    //viitataan lentokenttälistan "avain"-arvoon nimi (joka on jsonifyitu) ja luodaan "infotaulu", joka aukee, kun
    //hiiri menee lentokentän ylle
    Object.keys(lentsiJson).forEach(lentokentta => {
        //console.log(lentokentta)
        var marker = L.marker([lentsiJson[lentokentta].latitude, lentsiJson[lentokentta].longitude], markerOptions);
        marker.bindPopup(`<div id="infoPopup"><b>${lentokentta}</b></div>`);
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        marker.on('click', async function (e) {
            poroLat = e.latlng.lat;
            poroLng = e.latlng.lng;
            sijainti = lentokentta;
            aqi = lentsiJson[lentokentta]['air pollution index'];
            if (poro != undefined) {
                //poistetaan ikoni kentiltä, joista siirrytään pois
                map.removeLayer(poro);
                poro = spawnaaPoro(poroLat, poroLng, poroOptions, sijainti);
                map.addLayer(poro);
            }
            //tähän tulee funktio, joka pitää kirjaa kentistä, joihin on kakattu (+onko osuttu?)
            let uudetSpeksit = await fetch(
                `http://127.0.0.1:3000/liikkuminen?peli_id=${globalid}&kohde=${sijainti}`)
            // fetch (osoite/kakattu?icao=${lentsiJson[lentokentta].icao}&peli_id=${pelin id})
        });
        markerList.push(marker);
    })

    //lisätään karttaan layer, missä näkyy markkerit (tähän ehto, miten ikoni näkyy markkerien kanssa?)
    var airportGroup = L.layerGroup(markerList);
    airportMarkers = airportGroup;
    map.addLayer(airportMarkers);
}

async function kakkaa() {
    let kakkapaikka = await fetch(`http://127.0.0.1:3000/kakkaus?id=${globalid}&aqi=${aqi}`)
    const tiedot = await kakkapaikka.json()
    console.log(tiedot)
}

async function anna_lahja() {
    let lahjapaikka = await fetch(`http://127.0.0.1:3000/lahjaus?id=${globalid}&aqi=${aqi}`)
    const tiedot = await lahjapaikka.json()
    console.log(tiedot)
}

//luodaan funktio, jolla voidaan siirtää poroikonia (options on ulkonäkö ja liikutettavuus)
function spawnaaPoro(lat, lng, options, sij = "") {
    return L.marker([lat, lng], options);
}

//laitetaan poroikoni näkyviin
async function initialisoi() {
    var pukkiporo = spawnaaPoro(poroLat, poroLng, poroOptions);
    map.addLayer(pukkiporo);
    await tuoKarttaan(pukkiporo);
}

initialisoi()


//Avaus modal
window.addEventListener('load', event => {
    Adialog.showModal();
})
const Adialog = document.getElementById('alkuModal')
// dialogin sulkeminen
const closeAvausDialog = document.getElementById('sendStart')
//sulkee dialogin
closeAvausDialog.addEventListener('click', () => {
    Adialog.close();
})


