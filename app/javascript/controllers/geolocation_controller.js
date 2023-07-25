import { Controller } from "@hotwired/stimulus"
    
let map, infoWindow, gallPetersMapType;
const TILE_SIZE = 256;

// GeoJSON, describing the locations and names of some cities.
const cities = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-87.65, 41.85] },
      properties: { name: "Chicago" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-149.9, 61.218] },
      properties: { name: "Anchorage" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-99.127, 19.427] },
      properties: { name: "Mexico City" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-0.126, 51.5] },
      properties: { name: "London" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [28.045, -26.201] },
      properties: { name: "Johannesburg" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [15.322, -4.325] },
      properties: { name: "Kinshasa" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [151.207, -33.867] },
      properties: { name: "Sydney" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [0, 0] },
      properties: { name: "0°N 0°E" },
    },
  ],
};

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
      case "geolocation":
        this.geolocation();
        break;
      case "localizing":
        this.localizing();
        break;
      case "right_to_left":
        this.right_to_left();
        break;
      case "custom":
        this.custom();
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
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 10.657, lng: -61.518 },
      zoom: 9,
    });
  }

  pixel_tile() {
    const port_of_spain = new google.maps.LatLng(10.66, -61.52);
    map = new google.maps.Map(document.getElementById("map"), {
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

  geolocation() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 10.657, lng: -61.518 },
      zoom: 6,
    });
    infoWindow = new google.maps.InfoWindow();
  
    const locationButton = document.createElement("button");
  
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            this.handleLocationError(true, infoWindow, map.getCenter());
          },
        );
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, map.getCenter());
      }
    });
  }
  
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }

  // This example displays a map with the language and region set
  // to Japan. These settings are specified in the HTML script element
  // when loading the Google Maps JavaScript API.
  // Setting the language shows the map in the language of your choice.
  // Setting the region biases the geocoding results to that region.
  localizing() {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 35.717, lng: 139.731 },
    });
  }

  // This example displays a map with the language set to Arabic and the
  // regions set to Egypt. These settings are specified in the HTML script
  // element when loading the Google Maps JavaScript API.
  // Setting the language shows the map in the language of your choice.
  // Setting the region biases the geocoding results to that region.
  // In addition, the page's html element sets the text direction to
  // right-to-left.
  right_to_left() {
    const cairo = { lat: 30.064742, lng: 31.249509 };
    const map = new google.maps.Map(document.getElementById("map"), {
      scaleControl: true,
      center: cairo,
      zoom: 10,
    });
    const infowindow = new google.maps.InfoWindow();

    infowindow.setContent("<b>القاهرة</b>");

    const marker = new google.maps.Marker({ map, position: cairo });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  }

  // This example defines an image map type using the Gall-Peters
  // projection.
  // https://en.wikipedia.org/wiki/Gall%E2%80%93Peters_projection
  custom() {
    // Create a map. Use the Gall-Peters map type.
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 0,
      center: { lat: 0, lng: 0 },
      mapTypeControl: false,
    });

    this.initGallPeters();
    map.mapTypes.set("gallPeters", gallPetersMapType);
    map.setMapTypeId("gallPeters");

    // Show the lat and lng under the mouse cursor.
    const coordsDiv = document.getElementById("coords");

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(coordsDiv);
    map.addListener("mousemove", (event) => {
      coordsDiv.textContent =
        "lat: " +
        Math.round(event.latLng.lat()) +
        ", " +
        "lng: " +
        Math.round(event.latLng.lng());
    });
    // Add some markers to the map.
    map.data.setStyle((feature) => {
      return {
        title: feature.getProperty("name"),
        optimized: false,
      };
    });
    map.data.addGeoJson(cities);
  }

  initGallPeters() {
    const GALL_PETERS_RANGE_X = 800;
    const GALL_PETERS_RANGE_Y = 512;

    // Fetch Gall-Peters tiles stored locally on our server.
    gallPetersMapType = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        const scale = 1 << zoom;
        // Wrap tiles horizontally.
        const x = ((coord.x % scale) + scale) % scale;
        // Don't wrap tiles vertically.
        const y = coord.y;

        if (y < 0 || y >= scale) return "";
        return (
          "https://developers.google.com/maps/documentation/" +
          "javascript/examples/full/images/gall-peters_" +
          zoom +
          "_" +
          x +
          "_" +
          y +
          ".png"
        );
      },
      tileSize: new google.maps.Size(GALL_PETERS_RANGE_X, GALL_PETERS_RANGE_Y),
      minZoom: 0,
      maxZoom: 1,
      name: "Gall-Peters",
    });
    // Describe the Gall-Peters projection used by these tiles.
    gallPetersMapType.projection = {
      fromLatLngToPoint: function (latLng) {
        const latRadians = (latLng.lat() * Math.PI) / 180;
        return new google.maps.Point(
          GALL_PETERS_RANGE_X * (0.5 + latLng.lng() / 360),
          GALL_PETERS_RANGE_Y * (0.5 - 0.5 * Math.sin(latRadians)),
        );
      },
      fromPointToLatLng: function (point, noWrap) {
        const x = point.x / GALL_PETERS_RANGE_X;
        const y = Math.max(0, Math.min(1, point.y / GALL_PETERS_RANGE_Y));
        return new google.maps.LatLng(
          (Math.asin(1 - 2 * y) * 180) / Math.PI,
          -180 + 360 * x,
          noWrap,
        );
      },
    };
  }
}
