describe('Testing Weather Forecast page (app root)', () => {  
  const randomAddressNumber = Math.floor(Math.random(1) * 9999);;
  const locationNoZipCode = "Fairbanks, AK"
  const instructionText = "Enter a US street address or zip code to get the weather forecast.";
  const errorMessageText = 'This input does not have an associated zip code.';
  const errorMessageId = '#error-message';
  const locationInput = "[data-cy=google-places-autocomplete]";
  const zipcodeInput = "[data-cy=zip-code]";
  const submitButton = "[data-cy=submit-forecast]";
  const forecastCard = "[data-cy=forecast-card]";
  const tempResult = "[data-cy=temperature-result]";
  const cacheResult = "[data-cy=cache-result]";
  const instructions = "[data-cy=instructions]";

  beforeEach(() => {  
    cy.visit('/')
  })  
  
  it('displays a temperature result and forecast cards after submitting form', () => {  
    cy.get(instructions).should('contain', instructionText);

    // Type valid address and submit
    cy.get(locationInput).type(randomAddressNumber);
    cy.get('.pac-item', { timeout: 10000 }).should('be.visible').first().click();

    // Check that zip code input was populated after selecting Google Places option
    cy.get(zipcodeInput).should('not.have.value', '');
    
    cy.get(submitButton).click()
    
    // Assert temp result, cache result, and forecast cards show
    cy.get(tempResult).should('include.text', `it is currently`)
    cy.get(cacheResult).should('include.text', 'Cache')
    cy.get(forecastCard).its('length').should('eq', 4)
  });

  it('displays error when address is missing zip code and clears it on valid input', () => {
    // Type invalid address and submit
    cy.get(locationInput).type(locationNoZipCode);
    cy.get('.pac-item', { timeout: 10000 }).should('be.visible').first().click();

    // Check that zip code input is empty and error appears
    cy.get(zipcodeInput).should('have.value', '');
    cy.get(submitButton).should('be.disabled');
    cy.get(errorMessageId).should('include.text', errorMessageText);
    
    // Type valid address and submit
    cy.get(locationInput).clear().type(randomAddressNumber);
    cy.get('.pac-item', { timeout: 10000 }).should('be.visible').first().click();

    // Check that error indicators are gone
    cy.get(zipcodeInput).should('not.have.value', '');
    cy.get(errorMessageId).should('not.exist');
    cy.get(submitButton).should('not.be.disabled');

    // Check that cache hit indicator exists after submitting
    cy.get(submitButton).click()
    cy.get(cacheResult).should('include.text', 'Cache hit');
  })
})  
