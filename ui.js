'use strict';

const map = L.map('map').setView([55.97, 12.83], 4);
const airportMarkers = L.featureGroup().addTo(map);

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
  } finally {                                         // finally = this is executed anyway, whether the execution was successful or not
    console.log('asynchronous load complete');
  }
}

async function siirraKarttaan() {
  const lentsiJson = await noudaLentsidata();
  Object.keys(lentsiJson).forEach(lentokentta => {
    var marker = L.marker([lentsiJson[lentokentta].latitude, lentsiJson[lentokentta].longitude]).addTo(map);
    marker.bindPopup(`${lentokentta}`).openPopup();
  })
}

function spawnaaPoro() {
  var poroIkoni = L.icon({
    iconUrl: 'img/reindeer.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  L.marker([66.56167, 25.83083], {icon: poroIkoni}).addTo(map);
}

siirraKarttaan();
spawnaaPoro();