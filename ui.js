'use strict';
//leafletiin perustuvaa kartan luontia
const map = L.map('map').setView([55.97, 12.83], 4);

let kakatutKentat = [];
let poroLat = 66.56167;
let poroLng = 25.83083;
let sijainti = "Rovaniemi Airport";
//MIKSI EMME MÄÄRITTELE MUUTTUJAA GLOBALID t.tytti
let globalid;
const poroIkoni = L.icon({
    iconUrl: 'img/pukkiporo.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
  });
const poroOptions = {
   title: "Pukkiporomarkkeri",
   clickable: true,
   draggable: false,
   icon: poroIkoni,
   riseOnHover: true,
   riseOffset: 250
  }

  //kenttämerkit ja aloitus "Aloita peli"-napin tapahtumat nimen annon jälkeen
let airportMarkers;
const aloitaPeli = document.querySelector('#sendStart');
aloitaPeli.addEventListener('click', async () => {
  const pelaajanNimi = document.querySelector('#pelaajanNimi').value;

  const aloitusSpeksit = await fetch(
      `http://127.0.0.1:3000/porospeksit?pelaaja=${pelaajanNimi}&lat=${poroLat}&lng=${poroLng}&sijainti=${sijainti}`
  )
  //luodaan tiedot-muuttuja, missä json-tiedostona lähtötilanne
  const tiedot = await aloitusSpeksit.json()
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

//luodaan kakkanäppäin, joka ei returnaa mitään arvoa (void), sis. css muotoilun
var kakkanappain = L.Control.extend({
  options: {
    position: 'topright'
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('button');
    container.type = "button";
    container.innerHTML = '<img src="img/poop.png" height="100%" width="100%" style="padding: 1em;">'
    container.style.width = '64px';
    container.style.height = '64px';
    container.style.alignContent = 'center';
    container.style.border = '#88a9b2 2px solid';
    container.style.borderRadius = '2em';

    container.style.margin = '10px';
    container.style.alignContent = 'center';
    container.style.cursor = 'pointer';

    container.onclick = function(){
      kakkaa(globalid, poroLat, poroLng);
    }
    return container;
  },

});

//lisätään leaflet karttaan kakkanäppäin
map.addControl(new kakkanappain());

//noudetaan lentokenttä lista
async function noudaLentsidata() {
  console.log('Noudetaan lentokenttädataa');
  try {
    const noukittava = await fetch('http://127.0.0.1:3000/lentokentat/[]');
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
    var marker = L.marker([lentsiJson[lentokentta].latitude, lentsiJson[lentokentta].longitude], markerOptions);
    marker.bindPopup(`<div id="infoPopup"><b>${lentokentta}</b></div>`);
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });
    marker.on('click', async function(e) {
      poroLat = e.latlng.lat;
      poroLng = e.latlng.lng;
      sijainti = lentsiJson[lentokentta].name;
      if (poro != undefined) {
        //poistetaan ikoni kentiltä, joista siirrytään pois
        map.removeLayer(poro);
        poro = spawnaaPoro(poroLat, poroLng, poroOptions, sijainti);
        map.addLayer(poro);
      }
      //tähän tulee funktio, joka pitää kirjaa kentistä, joihin on kakattu (+onko osuttu?)
      let uudetSpeksit = await fetch(
      `http://127.0.0.1:3000/porospeksit?pelaaja=${pelaajanNimi}&lat=${poroLat}&lng=${poroLng}&sijainti=${sijainti}`)
      // fetch (osoite/kakattu?icao=${lentsiJson[lentokentta].icao}&peli_id=${pelin id})
    });
    markerList.push(marker);
  })

  //lisätään karttaan layer, missä näkyy markkerit (tähän ehto, miten ikoni näkyy markkerien kanssa?)
  var airportGroup = L.layerGroup(markerList);
  airportMarkers = airportGroup;
  map.addLayer(airportMarkers);
}

//kakkamäärä turha? ei pelin sujuvuuden kannalta tärkeä
let kakkamaarat = 0;

async function kakkaa(id, lat, lng) {
  kakkamaarat++;
  let kakkapaikka = await fetch(`http://127.0.0.1:3000/kakkaus?id=${id}`)
  console.log(`Olet kakannut ${kakkamaarat} kertaa.`);
}

//luodaan funktio, jolla voidaan siirtää poroikonia (options on ulkonäkö ja liikutettavuus)
function spawnaaPoro(lat, lng, options, sij="") {
  let poro = L.marker([lat, lng], options);
  if (sij != "") {

  }
  return poro;
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
//about dialogin sulkeminen
const closeAvausDialog = document.getElementById('sendStart')
//sulkee about dialogin
closeAvausDialog.addEventListener('click',() => {
  Adialog.close();
})