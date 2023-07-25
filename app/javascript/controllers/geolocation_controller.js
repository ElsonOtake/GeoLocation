import { Controller } from "@hotwired/stimulus"

  // const options = {
  //   enableHighAccuracy: true,
  //   timeout: 5000,
  //   maximumAge: 0,
  // };
    
const TILE_SIZE = 256;

// Connects to data-controller="geolocation"
export default class extends Controller {
  static values = { page: String }

  connect() {
    switch(this.pageValue) {
      case "simple_map":
        this.simple_map();
        break;
      case "pixel_tile":
        this.pixel_tile();
        break;
      default:
        console.log("page not found!");
    }
  }
  search() {
    navigator.geolocation.getCurrentPosition(this.success, this.error, options);
  }
  
  success(pos) {
    const crd = pos.coords;
  
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    location.assign(`/locations?place=${crd.latitude},${crd.longitude}`)
  }
  
  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  simple_map() {
    let map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 10.657, lng: -61.518 },
      zoom: 9,
    });
  }

  pixel_tile() {
    const port_of_spain = new google.maps.LatLng(10.66, -61.52);
    const map = new google.maps.Map(document.getElementById("map"), {
      center: port_of_spain,
      zoom: 3,
    });
    const coordInfoWindow = new google.maps.InfoWindow();
  
    coordInfoWindow.setContent(this.createInfoWindowContent(port_of_spain, map.getZoom()));
    coordInfoWindow.setPosition(port_of_spain);
    coordInfoWindow.open(map);
    map.addListener("zoom_changed", () => {
      coordInfoWindow.setContent(this.createInfoWindowContent(port_of_spain, map.getZoom()));
      coordInfoWindow.open(map);
    });
  }

  createInfoWindowContent(latLng, zoom) {
    const scale = 1 << zoom;
    const worldCoordinate = this.project(latLng);
    const pixelCoordinate = new google.maps.Point(
      Math.floor(worldCoordinate.x * scale),
      Math.floor(worldCoordinate.y * scale),
    );
    const tileCoordinate = new google.maps.Point(
      Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
      Math.floor((worldCoordinate.y * scale) / TILE_SIZE),
    );
    return [
      "Port of Spain, TT",
      "LatLng: " + latLng,
      "Zoom level: " + zoom,
      "World Coordinate: " + worldCoordinate,
      "Pixel Coordinate: " + pixelCoordinate,
      "Tile Coordinate: " + tileCoordinate,
    ].join("<br>");
  }
  
  // The mapping between latitude, longitude and pixels is defined by the web
  // mercator projection.
  project(latLng) {
    let siny = Math.sin((latLng.lat() * Math.PI) / 180);
  
    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return new google.maps.Point(
      TILE_SIZE * (0.5 + latLng.lng() / 360),
      TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
    );
  }
}
