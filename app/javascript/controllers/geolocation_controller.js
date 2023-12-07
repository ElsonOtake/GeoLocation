import { Controller } from "@hotwired/stimulus"
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import '../src/google_maps'

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

const properties = [
  {
    address: "215 Emily St, MountainView, CA",
    description: "Single family house with modern design",
    price: "$ 3,889,000",
    type: "home",
    bed: 5,
    bath: 4.5,
    size: 300,
    position: {
      lat: 37.50024109655184,
      lng: -122.28528451834352,
    },
  },
  {
    address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
    description: "Townhouse with friendly neighbors",
    price: "$ 3,050,000",
    type: "building",
    bed: 4,
    bath: 3,
    size: 200,
    position: {
      lat: 37.44440882321596,
      lng: -122.2160620727,
    },
  },
  {
    address: "100 Chris St, Portola Valley, CA",
    description: "Spacious warehouse great for small business",
    price: "$ 3,125,000",
    type: "warehouse",
    bed: 4,
    bath: 4,
    size: 800,
    position: {
      lat: 37.39561833718522,
      lng: -122.21855116258479,
    },
  },
  {
    address: "98 Aleh Ave, Palo Alto, CA",
    description: "A lovely store on busy road",
    price: "$ 4,225,000",
    type: "store-alt",
    bed: 2,
    bath: 1,
    size: 210,
    position: {
      lat: 37.423928529779644,
      lng: -122.1087629822001,
    },
  },
  {
    address: "2117 Su St, MountainView, CA",
    description: "Single family house near golf club",
    price: "$ 1,700,000",
    type: "home",
    bed: 4,
    bath: 3,
    size: 200,
    position: {
      lat: 37.40578635332598,
      lng: -122.15043378466069,
    },
  },
  {
    address: "197 Alicia Dr, Santa Clara, CA",
    description: "Multifloor large warehouse",
    price: "$ 5,000,000",
    type: "warehouse",
    bed: 5,
    bath: 4,
    size: 700,
    position: {
      lat: 37.36399747905774,
      lng: -122.10465384268522,
    },
  },
  {
    address: "700 Jose Ave, Sunnyvale, CA",
    description: "3 storey townhouse with 2 car garage",
    price: "$ 3,850,000",
    type: "building",
    bed: 4,
    bath: 4,
    size: 600,
    position: {
      lat: 37.38343706184458,
      lng: -122.02340436985183,
    },
  },
  {
    address: "868 Will Ct, Cupertino, CA",
    description: "Single family house in great school zone",
    price: "$ 2,500,000",
    type: "home",
    bed: 3,
    bath: 2,
    size: 100,
    position: {
      lat: 37.34576403052,
      lng: -122.04455090047453,
    },
  },
  {
    address: "655 Haylee St, Santa Clara, CA",
    description: "2 storey store with large storage room",
    price: "$ 2,500,000",
    type: "store-alt",
    bed: 3,
    bath: 2,
    size: 450,
    position: {
      lat: 37.362863347890716,
      lng: -121.97802139023555,
    },
  },
  {
    address: "2019 Natasha Dr, San Jose, CA",
    description: "Single family house",
    price: "$ 2,325,000",
    type: "home",
    bed: 4,
    bath: 3.5,
    size: 500,
    position: {
      lat: 37.41391636421949,
      lng: -121.94592071575907,
    },
  },
];

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// Connects to data-controller="geolocation"
export default class extends Controller {
  static targets = [ "coordinates", "simpleMap", "pixelTile", "geolocation", "localizing", "rightToLeft", "custom", "literal",
    "simpleClick", "properties", "latLng", "bounds", "htmlMarker", "advancedMarker", "centeredMarker", "clusterMarkers",
    "circles", "infoWindows", "customizeAdvanced_marker", "interactiveMarker" ]
  static values = { page: String }

  coordinatesTargetConnected = () => {
    this.coordinates();
  }

  simpleMapTargetConnected = () => {
    this.simple_map();
  }

  pixelTileTargetConnected = () => {
    this.pixel_tile();
  }

  geolocationTargetConnected = () => {
    this.geolocation();
  }

  localizingTargetConnected = () => {
    this.localizing();
  }

  rightToLeftTargetConnected = () => {
    this.right_to_left();
  }

  customTargetConnected = () => {
    this.custom();
  }

  literalTargetConnected = () => {
    this.literal();
  }

  simpleClickTargetConnected = () => {
    this.simple_click();
  }

  propertiesTargetConnected = () => {
    this.properties();
  }

  latLngTargetConnected = () => {
    this.lat_lng();
  }

  boundsTargetConnected = () => {
    this.bounds();
  }

  htmlMarkerTargetConnected = () => {
    this.html_marker();
  }

  advancedMarkerTargetConnected = () => {
    this.advanced_marker();
  }

  centeredMarkerTargetConnected = () => {
    this.centered_marker();
  }

  clusterMarkersTargetConnected = () => {
    this.cluster_markers();
  }

  circlesTargetConnected = () => {
    this.circles();
  }

  infoWindowsTargetConnected = () => {
    this.info_windows();
  }

  customizeAdvanced_markerTargetConnected = () => {
    this.customize_advanced_marker();
  }

  interactiveMarkerTargetConnected = () => {
    this.interactive_marker();
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

  info_windows = async () => {
    const uluru = { lat: -25.363, lng: 131.044 };
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: uluru,
    });
    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
      '<div id="bodyContent">' +
      "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
      "sandstone rock formation in the southern part of the " +
      "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
      "south west of the nearest large town, Alice Springs; 450&#160;km " +
      "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
      "features of the Uluru - Kata Tjuta National Park. Uluru is " +
      "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
      "Aboriginal people of the area. It has many springs, waterholes, " +
      "rock caves and ancient paintings. Uluru is listed as a World " +
      "Heritage Site.</p>" +
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
      "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
      "(last visited June 22, 2009).</p>" +
      "</div>" +
      "</div>";
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "Uluru",
    });
    marker = new google.maps.Marker({
      position: uluru,
      map,
      title: "Uluru (Ayers Rock)",
    });
  
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
  }

  html_marker = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map"), {
      center: { lat: 37.42, lng: -122.1 },
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });
    const priceTag = document.createElement("div");
  
    priceTag.className = "price-tag";
    priceTag.innerText = "$2.5M";
  
    marker = new AdvancedMarkerElement({
      map,
      position: { lat: 37.42, lng: -122.1 },
      content: priceTag,
    });
  }

  customize_advanced_marker = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
      "marker",
    );
    map = new Map(document.getElementById("map"), {
      center: { lat: 37.419, lng: -122.02 },
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });
    // Each PinElement is paired with a MarkerView to demonstrate setting each parameter.
    // Default marker with title text (no PinElement).
    const markerViewWithText = new AdvancedMarkerElement({
      map,
      position: { lat: 37.419, lng: -122.03 },
      title: "Title text for the marker at lat: 37.419, lng: -122.03",
    });
    // Adjust the scale.
    const pinScaled = new PinElement({
      scale: 1.5,
    });
    const markerViewScaled = new AdvancedMarkerElement({
      map,
      position: { lat: 37.419, lng: -122.02 },
      content: pinScaled.element,
    });
    // Change the background color.
    const pinBackground = new PinElement({
      background: "#FBBC04",
    });
    const markerViewBackground = new AdvancedMarkerElement({
      map,
      position: { lat: 37.419, lng: -122.01 },
      content: pinBackground.element,
    });
    // Change the border color.
    const pinBorder = new PinElement({
      borderColor: "#137333",
    });
    const markerViewBorder = new AdvancedMarkerElement({
      map,
      position: { lat: 37.415, lng: -122.03 },
      content: pinBorder.element,
    });
    // Change the glyph color.
    const pinGlyph = new PinElement({
      glyphColor: "white",
    });
    const markerViewGlyph = new AdvancedMarkerElement({
      map,
      position: { lat: 37.415, lng: -122.02 },
      content: pinGlyph.element,
    });
    // Hide the glyph.
    const pinNoGlyph = new PinElement({
      glyph: "",
    });
    const markerViewNoGlyph = new AdvancedMarkerElement({
      map,
      position: { lat: 37.415, lng: -122.01 },
      content: pinNoGlyph.element,
    });
  }

  interactive_marker = async () => {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLng } = await google.maps.importLibrary("core");
    const center = new LatLng(37.43238031167444, -122.16795397128632);
    map = new Map(document.getElementById("map"), {
      zoom: 11,
      center,
      mapId: "4504f8b37365c3d0",
    });

    for (const property of properties) {
      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
        map,
        content: this.buildContent(property),
        position: property.position,
        title: property.description,
      });

      AdvancedMarkerElement.addListener("click", () => {
        this.toggleHighlight(AdvancedMarkerElement, property);
      });
    }
  }

  toggleHighlight = (markerView, property) => {
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }
  }

  buildContent = (property) => {
    const content = document.createElement("div");

    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
          <span class="fa-sr-only">${property.type}</span>
      </div>
      <div class="details">
          <div class="price">${property.price}</div>
          <div class="address">${property.address}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${property.bed}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span class="fa-sr-only">bathroom</span>
              <span>${property.bath}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
              <span class="fa-sr-only">size</span>
              <span>${property.size} ft<sup>2</sup></span>
          </div>
          </div>
      </div>
      `;
    return content;
    }
  }
