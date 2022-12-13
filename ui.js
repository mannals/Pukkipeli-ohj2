'use strict';

const map = L.map('map').setView([55.97, 12.83], 4);
let poroLat = 66.56167
let poroLng = 25.83083
var airportMarkers = null;
var poroIkoni = L.icon({
    iconUrl: 'img/pukkiporo.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
  });
var poroOptions = {
   title: "Pukkiporomarkkeri",
   clickable: true,
   draggable: false,
   icon: poroIkoni,
   riseOnHover: true,
   riseOffset: 250
  }

var layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

map.addLayer(layer);

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
    marker.on('click', function(e) {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;
      if (poro != undefined) {
        map.removeLayer(poro);
        poro = L.marker([lat, lng], poroOptions).addTo(map);
      }
    })
    markerList.push(marker);
  })

  var airportGroup = L.layerGroup(markerList);
  airportMarkers = airportGroup;
  map.addLayer(airportMarkers);
}

function layerOrder() {
  global
}


function kentilleLiikkuminen(ryhma) {
  Object.keys(ryhma).forEach(markkeri => {
    markkeri.on('click', function(e) {
      var latLng = e.latlng;
      liikutaPoroa(latLng[0], latlng[1]);
    })
  })
}

function spawnaaPoro(lat, lng, options) {
  var poro = L.marker([lat, lng], options);
  return poro;
}

function liikutaPoroa(lat, lng, poro) {
  map.removeLayer(poro);
  const poroIkoni = L.icon({
    iconUrl: 'img/pukkiporo.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
  });
  let poroOptions = {
   title: "Pukkiporomarkkeri",
   clickable: true,
   draggable: false,
   icon: poroIkoni,
   riseOnHover: true,
   riseOffset: 250
  }
  var poro = L.marker([lat, lng], poroOptions);
  map.addLayer(poro);

}


async function initialisoi() {
  var pukkiporo = spawnaaPoro(poroLat, poroLng, poroOptions);
  map.addLayer(pukkiporo);
  await tuoKarttaan(pukkiporo);

}

initialisoi();

