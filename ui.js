'use strict';

const map = L.map('map').setView([55.97, 12.83], 4);

let kakatutKentat = [];
let poroLat = 66.56167;
let poroLng = 25.83083;
let sijainti = "Rovaniemi Airport";
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

let airportMarkers;
const aloitaPeli = document.querySelector('#sendStart');
aloitaPeli.addEventListener('click', async () => {
  const pelaajanNimi = document.querySelector('#pelaajanNimi').value;

  const aloitusSpeksit = await fetch(
      `http://127.0.0.1:3000/porospeksit?pelaaja=${pelaajanNimi}&lat=${poroLat}&lng=${poroLng}&sijainti=${sijainti}`
  )
  const tiedot = await aloitusSpeksit.json()
  globalid = tiedot.id


})

var layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  draggable: false
});

map.addLayer(layer);

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

map.addControl(new kakkanappain());

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

async function tuoKarttaan(poro) {
  let lentsiJson = await noudaLentsidata();
  let markerList = [];
  let markerOptions = {
   title: "Lentokenttamarkkeri",
   clickable: true,
   draggable: false
  }

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
        map.removeLayer(poro);
        poro = spawnaaPoro(poroLat, poroLng, poroOptions, sijainti);
        map.addLayer(poro);
      }
      let uudetSpeksit = await fetch(
      `http://127.0.0.1:3000/porospeksit?pelaaja=${pelaajanNimi}&lat=${poroLat}&lng=${poroLng}&sijainti=${sijainti}`)
      // fetch (osoite/kakattu?icao=${lentsiJson[lentokentta].icao}&peli_id=${pelin id})
    });
    markerList.push(marker);
  })

  var airportGroup = L.layerGroup(markerList);
  airportMarkers = airportGroup;
  map.addLayer(airportMarkers);
}

let kakkamaarat = 0;

async function kakkaa(id, lat, lng) {
  kakkamaarat++;
  let kakkapaikka = await fetch(`http://127.0.0.1:3000/kakkaus?id=${id}`)
  console.log(`Olet kakannut ${kakkamaarat} kertaa.`);
}

function spawnaaPoro(lat, lng, options, sij="") {
  let poro = L.marker([lat, lng], options);
  if (sij != "") {

  }
  return poro;
}

async function initialisoi() {
  var pukkiporo = spawnaaPoro(poroLat, poroLng, poroOptions);
  map.addLayer(pukkiporo);
  await tuoKarttaan(pukkiporo);
}

initialisoi()


