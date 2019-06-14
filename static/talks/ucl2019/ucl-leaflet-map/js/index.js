/* globals L */
// https://tools.wmflabs.org/geohack/geohack.php?pagename=One_Canada_Square&params=51_30_18_N_0_01_10.6_W_region:GB_scale:5000_type:landmark
let defaultMapParams = {
  url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
}

let Esri_WorldStreetMapParams = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}

let params = defaultMapParams
//let params = Esri_WorldStreetMapParams

let oneCanadaHouseCoords = {
  latLng: [51.5056, 0.0185], name: "UCL Business School, One Canada House"
}
let mainUCLCampusCoords = {
  latLng: [51.5248, -0.1336], name: "Main UCL Campus"
}
let UCLEastCoords = {
  latLng: [51.5465, -0.01269], name: "UCL Campus East"
}

let mapZoom = 14
let mymap = L.map('mapid').setView(oneCanadaHouseCoords.latLng, mapZoom)

L.tileLayer(params.url, {
    attribution: params.attribution,
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoia3lyYW4tZGFsZSIsImEiOiJjanZkbWE0cjkwNjkxNDBwYW0xb3p4MmtqIn0.WP9fQgGMgu8_nmMxJwFsbg'
}).addTo(mymap)
// Set our waypoints
// let mymap = L.map('mapid').setView(oneCanadaHouseCoords.latLng, 14)

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'pk.eyJ1Ijoia3lyYW4tZGFsZSIsImEiOiJjanZkbWE0cjkwNjkxNDBwYW0xb3p4MmtqIn0.WP9fQgGMgu8_nmMxJwFsbg'
// }).addTo(mymap)

// see https://leafletjs.com/reference-1.5.0.html#marker for customizing markers
let canMarker = L.marker(oneCanadaHouseCoords.latLng, {title: oneCanadaHouseCoords.name}).addTo(mymap)

let mainMarker = L.marker(mainUCLCampusCoords.latLng).addTo(mymap)

let eastMarker = L.marker(UCLEastCoords.latLng).addTo(mymap)

let markers = [mainMarker, canMarker, eastMarker]

canMarker.bindPopup("UCL Business School, One Canada House, Canary Wharf")

let group = new L.featureGroup(markers)

//mymap.fitBounds(group.getBounds())

let waypoints = [oneCanadaHouseCoords, mainUCLCampusCoords].map(d => {
  return L.Routing.waypoint(d.latLng, d.name)
})

let routingControl = L.Routing.control({
  waypoints: waypoints,
      //oneCanadaHouseCoords,
      //mainUCLCampusCoords
        // L.latLng(57.74, 11.94),
        // L.latLng(57.6792, 11.949)
    //],
    routeWhileDragging: true
}).addTo(mymap)

let reverseRoute = function(e) {
  console.log("Reversing the route...")
  routingControl.setWaypoints(routingControl.getWaypoints().reverse())
}

let setEndpoint = e => {
  console.log("Chosen waypoint: ", e)
  let waypoints = routingControl.getWaypoints()
  waypoints[waypoints.length-1] = L.Routing.waypoint(e.latlng)
  routingControl.setWaypoints(waypoints)
}

eastMarker.on("click", setEndpoint);

[eastMarker, canMarker, mainMarker].map(marker => {
  marker.on("click", setEndpoint)
})
