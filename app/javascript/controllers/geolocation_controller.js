import { Controller } from "@hotwired/stimulus"

  // const options = {
  //   enableHighAccuracy: true,
  //   timeout: 5000,
  //   maximumAge: 0,
  // };

// Connects to data-controller="geolocation"
export default class extends Controller {
  static values = { page: String }

  connect() {
    switch(this.pageValue) {
      case "simple_map":
        this.simple_map();
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
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
}
