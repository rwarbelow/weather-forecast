import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "field" ]

  connect() {
    window.addEventListener('google-maps-callback', () => {
      this.initializeAutocomplete();
    });
  }

  // add Google Maps Autocomplete and listen for place_changed event
  initializeAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(this.fieldTarget);
    this.autocomplete.addListener('place_changed', () => {
      this.setCoordinates();
    });
  }

  // when place_changed, get zip code from place and set as zip_code input
  setCoordinates() {
    const place = this.autocomplete.getPlace();
    const zipCode = place.address_components.find((c) => c.types.includes('postal_code'));
    const zipCodeField = this.element.querySelector('input[name="zip_code"]');
    zipCodeField.value = zipCode.long_name;
  }
}
