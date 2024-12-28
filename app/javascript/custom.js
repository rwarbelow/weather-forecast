$(function() {
  window.initMap = function() {
    const addressField = $('[data-places-target="field"]');
    const zipCodeInput = 'input[name=zip_code]';
    const errorMessageId = '#error-message';
    const forecastButtonId = '#get-forecast-button';
    const weatherFormId = '#weather-forecast-form';
    const weatherResultContainerId = '#weather-result-container';
    const errorMessage = 'Please choose a US street address or zip code. This input does not have an associated zip code.';
    const autocomplete = new google.maps.places.Autocomplete(addressField[0]);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      const selectedPlace = autocomplete.getPlace();
      const zipCode = selectedPlace.address_components.find((c) => c.types.includes('postal_code'));
      if(zipCode) {
        $(errorMessageId).remove();
        $(forecastButtonId).prop('disabled', false);
        $(zipCodeInput).val(zipCode.long_name);
      } else {
        $(weatherFormId).append(
          $('<div id="error-message"></div>').text(errorMessage)
        );
        $(weatherResultContainerId).remove();
        $(forecastButtonId).prop('disabled', true);
      }
    });
  };

  $(document).on('keydown', '#google-places-autocomplete', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });
});