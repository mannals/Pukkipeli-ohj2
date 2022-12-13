'use strict';

const map = L.map('map').setView([55.97, 12.83], 4);
let airportMarkers = null;

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

async function tuoKarttaan() {
  let lentsiJson = await noudaLentsidata();
  let markerList = [];

  Object.keys(lentsiJson).forEach(lentokentta => {
    var marker = L.marker([lentsiJson[lentokentta].latitude, lentsiJson[lentokentta].longitude]);
    marker.bindPopup(`<div id="infoPopup"><b>${lentokentta}</b></div>`);
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });
    markerList.push(marker);
  })

  let airportGroup = L.layerGroup(markerList);
  map.addLayer(airportGroup);
}



function kentilleLiikkuminen(ryhma) {
  Object.keys(ryhma).forEach(markkeri => {
    markkeri.on('click', function(e) {
      var latLng = e.latlng;
      liikutaPoroa(latLng[0], latlng[1]);
    })
  })
}

let poroLat = 66.56167
let poroLng = 25.83083

function spawnaaPoro(lat, lng) {
  var poroIkoni = L.icon({
    iconUrl: 'img/pukkiporo.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
  });
  let poro = L.marker([lat, lng], {icon: poroIkoni}, {draggable:'true', autopan: 'true'});
  map.addLayer(poro);
}

function liikutaPoroa(lat, lng) {
  map.removeLayer(poro);
  var poroIkoni = L.icon({
    iconUrl: 'img/pukkiporo.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
  });
  let poro = L.marker([lat, lng], {icon: poroIkoni}, {draggable:'true', autopan: 'true'});
  map.addLayer(poro);

}


function initialisoi() {
  tuoKarttaan();
  spawnaaPoro(poroLat, poroLng);
}

initialisoi();

