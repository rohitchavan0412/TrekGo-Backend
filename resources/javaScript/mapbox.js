
const loc = JSON.parse(document.getElementById('map').dataset.locations);
console.log(loc)

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyc2hhbGFibmF2ZSIsImEiOiJjazhoYTB1cDYwMncyM2ZwYWI0a2VqMnptIn0.gwtvIO28L0dzByUSRH4HkQ';

//mapbox style code
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/harshalabnave/ck8ha7tb30mod1ipmtetqe0ke',
  scrollZoom: false
  // center: [73.8474942, 18.5074263],
  // zoom: 14,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

//loop over the locations
loc.forEach(location => {
  // create the marker fot the location
  const el = document.createElement('div');
  el.className = 'marker';

  // add that marker to mapbox
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(location.coordinates).addTo(map);

  bounds.extend(location.coordinates)
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100
  }
});