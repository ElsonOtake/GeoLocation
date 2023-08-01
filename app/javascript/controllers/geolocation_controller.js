import { Controller } from "@hotwired/stimulus"
import { MarkerClusterer } from "@googlemaps/markerclusterer";

let map, marker, infoWindow, gallPetersMapType;
const TILE_SIZE = 256;

const NEW_ZEALAND_BOUNDS = {
  north: -34.36,
  south: -47.35,
  west: 166.28,
  east: -175.81,
};
const AUCKLAND = { lat: -37.06, lng: 174.58 };

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

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
];

const citymap = {
  chicago: {
    center: { lat: 41.878, lng: -87.629 },
    population: 2714856,
  },
  newyork: {
    center: { lat: 40.714, lng: -74.005 },
    population: 8405837,
  },
  losangeles: {
    center: { lat: 34.052, lng: -118.243 },
    population: 3857799,
  },
  vancouver: {
    center: { lat: 49.25, lng: -123.1 },
    population: 603502,
  },
};

// Connects to data-controller="geolocation"
export default class extends Controller {
  static values = { page: String }

  connect() {
    switch(this.pageValue) {
      case "coordinates":
        this.coordinates();
        break;
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
      case "literal":
        this.literal();
        break;
      case "simple_click":
        this.simple_click();
        break;
      case "properties":
        this.properties();
        break;
      case "lat_lng":
        this.lat_lng();
        break;
      case "bounds":
        this.bounds();
        break;
      case "advanced_marker":
        this.advanced_marker();
        break;
      case "centered_marker":
        this.centered_marker();
        break;
      case "cluster_markers":
        this.cluster_markers();
        break;
      case "circles":
        this.circles();
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

  coordinates = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 3 // Adjust the zoom level as needed
    });
    
    // Add a click event listener to get the coordinates on click
    map.addListener('click', function(event) {
      let latitude = event.latLng.lat();
      let longitude = event.latLng.lng();
      
      // Do something with the latitude and longitude, e.g., display them in an alert
      alert('Latitude: ' + latitude + ', Longitude: ' + longitude);
    });
  }

  simple_map = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById('map'), {
      center: { lat: 10.657, lng: -61.518 },
      zoom: 9,
    });
  }

  pixel_tile = async () => {
    const port_of_spain = new google.maps.LatLng(10.66, -61.52);
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
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

  geolocation = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
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
  localizing = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
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
  right_to_left = async () => {
    const cairo = { lat: 30.064742, lng: 31.249509 };
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
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
  custom = async () => {
    // Create a map. Use the Gall-Peters map type.
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
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

  // In this example, we center the map, and add a marker, using a LatLng object
  // literal instead of a google.maps.LatLng object. LatLng object literals are
  // a convenient way to add a LatLng coordinate and, in most cases, can be used
  // in place of a google.maps.LatLng object.
  literal = async () => {
    const mapOptions = {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 },
    };
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), mapOptions);

    const marker = new google.maps.Marker({
      // The below line is equivalent to writing:
      // position: new google.maps.LatLng(-34.397, 150.644)
      position: { lat: -34.397, lng: 150.644 },
      map: map,
    });
    // You can use a LatLng literal in place of a google.maps.LatLng object when
    // creating the Marker object. Once the Marker object is instantiated, its
    // position will be available as a google.maps.LatLng object. In this case,
    // we retrieve the marker's position using the
    // google.maps.LatLng.getPosition() method.
    const infowindow = new google.maps.InfoWindow({
      content: "<p>Marker Location:" + marker.getPosition() + "</p>",
    });

    google.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });
  }

  simple_click = async () => {
    const myLatlng = { lat: 10.657, lng: -61.518 };
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      zoom: 10,
      center: myLatlng,
    });
    const marker = new google.maps.Marker({
      position: myLatlng,
      map,
      title: "Click to zoom",
    });
  
    map.addListener("center_changed", () => {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      window.setTimeout(() => {
        map.panTo(marker.getPosition());
      }, 3000);
    });
    marker.addListener("click", () => {
      map.setZoom(12);
      map.setCenter(marker.getPosition());
    });
  }

  properties = async () => {
    const originalMapCenter = new google.maps.LatLng(10.657267, -61.518017);
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: originalMapCenter,
    });
    const infowindow = new google.maps.InfoWindow({
      content: "Change the zoom level",
      position: originalMapCenter,
    });
  
    infowindow.open(map);
    map.addListener("zoom_changed", () => {
      infowindow.setContent("Zoom: " + map.getZoom());
    });
  }

  lat_lng = async () => {
    const myLatlng = { lat: 10.657, lng: -61.518 };
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      zoom: 10,
      center: myLatlng,
    });
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: myLatlng,
    });
  
    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
      );
      infoWindow.open(map);
    });
  }

  bounds = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      center: AUCKLAND,
      restriction: {
        latLngBounds: NEW_ZEALAND_BOUNDS,
        strictBounds: false,
      },
      zoom: 7,
      mapId: "DEMO_MAP_ID",
    });
  }

  advanced_marker = async () => {
    const position = { lat: 10.657, lng: -61.518 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map"), {
      center: position,
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });
    marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: "Port of Spain",
    });
  }

  centered_marker = async () => {
    const position = { lat: 10.657, lng: -61.518 };
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      center: position,
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });
  }

  cluster_markers = async () => {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
      zoom: 3,
      center: { lat: -28.024, lng: 140.887 },
    });
    const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    // Create an array of alphabetical characters used to label the markers.
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Add some markers to the map.
    const markers = locations.map((position, i) => {
      const label = labels[i % labels.length];
      const marker = new google.maps.Marker({
        position,
        label,
      });
  
      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(label);
        infoWindow.open(map, marker);
      });
      return marker;
    });
  
    // Add a marker clusterer to manage the markers.
    new MarkerClusterer({ markers, map });
  }

  circles = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: { lat: 37.09, lng: -95.712 },
      mapTypeId: "terrain",
    });
  
    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (const city in citymap) {
      // Add the circle for this city to the map.
      const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: citymap[city].center,
        radius: Math.sqrt(citymap[city].population) * 100,
      });
    }
  }
}
