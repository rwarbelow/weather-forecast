describe('Testing Weather Forecast page (app root)', () => {  
  const address = "12345 Denver West Circle"
  const zipCode = "80401"
  const locationInput = "[data-cy=google-places-autocomplete]"
  const zipcodeInput = "[data-cy=zip-code]"
  const submitButton = "[data-cy=submit-forecast]"
  const forecastCard = "[data-cy=forecast-card]"
  const tempResult = "[data-cy=temperature-result]"
  const cacheResult = "[data-cy=cache-result]"

  beforeEach(() => {  
    cy.visit('/')
  })  
  
  it('Displays a temperature result and forecast cards after submitting form', () => {  
    // Type address and submit
    cy.get('[data-cy=instructions]').should('contain', 'Enter an address to get the weather forecast.');
    cy.get(locationInput).type(address);
    cy.get('.pac-item', { timeout: 10000 }).should('be.visible');
    cy.get(locationInput).type('{downarrow}');
    cy.get(locationInput).type('{enter}');
    cy.get(zipcodeInput).should('have.value', '80401');
    cy.get(submitButton).click()
    
    // Assert temp result, cache result, and forecast cards show
    cy.get(tempResult).should('include.text', `In ${zipCode}, it is currently`)
    cy.get(cacheResult).should('include.text', 'Cache')
    cy.get(forecastCard).its('length').should('eq', 4)
  })  
})  
  