import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["field"];

  connect() {
    window.addEventListener("google-maps-callback", () => {
      this.initializeAutocomplete();
    });

    this.element.addEventListener("keydown", (event) => this.preventFormSubmission(event));
  }

  // Add Google Maps Autocomplete and listen for place_changed event
  initializeAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(this.fieldTarget);
    this.autocomplete.addListener("place_changed", () => {
      this.setZipCode();
    });
  }

  // When place_changed, get zip code from place and set as zip_code input
  setZipCode() {
    const place = this.autocomplete.getPlace();
    const zipCode = place.address_components.find((c) => c.types.includes("postal_code"));
    const zipCodeField = this.element.querySelector('input[name="zip_code"]');
    zipCodeField.value = zipCode?.long_name || "";
  }

  // Don't submit form when enter is pressed; only select option from dropdown
  preventFormSubmission(event) {
    if (event.key === "Enter" && event.target === this.fieldTarget) {
      event.preventDefault();
    }
  }
}
