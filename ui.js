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

async function tuoKarttaan() {
  const lentsiJson = await noudaLentsidata();
  Object.keys(lentsiJson).forEach(lentokentta => {
    var marker = L.marker([lentsiJson[lentokentta].latitude, lentsiJson[lentokentta].longitude]).addTo(map);
    marker.bindPopup(`<div id="infoPopup"><b>${lentokentta}</b><br><button id="lentonappain" type="button" style="width: 100%;">Lennä</button></div>`).openPopup();
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

function initialisoi() {
  tuoKarttaan();
  spawnaaPoro(poroLat, poroLng);
}

initialisoi();

//modal heti ladatessa, EI TOIMI
var startModal = new bootstrap.Modal(document.getElementById('startModal'))
startModal.show();
//muuttujat about dialogin sulkemiselle
const dialog = document.getElementById('startModal')
const closeDialog = document.getElementById('span')
//sulkee about dialogin
closeDialog.addEventListener('click',() => {
  dialog.close();
})