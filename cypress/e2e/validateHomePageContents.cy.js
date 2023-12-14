/**
 * @author      shahin.rastgar@gmail.com
 * @copyright   Copyright (c) ShahinR
 * @license     Proprietary
 */

describe(`Cypress Test Suite for: ` + Cypress.env("urlToTest"), () => {
  beforeEach(() => {
    cy.callFrontOffice();
    cy.IgnoreJSUncaughtExceptions();
    cy.waitForFullyLoad();
  });

  it('Header & footer validations', function () {
    // Logo
    cy.validateDomElementsAssertion('[data-test="nav-logo-link"]');
    cy.get('[data-test="nav-logo-link"]')
      .invoke("attr", "href")
      .then((hrefValueToCall) => {
        cy.request(hrefValueToCall).its('status').should('eq', 200);
      });

    // Page scrolling function
    cy.get('[data-test="load-more-button"]').scrollIntoView().wait(3000);

    // Ensure scrolling down worked correctly
    cy.get('[data-test="pexels-attribution-link"]');
    cy.get('[data-test="load-more-button"]').should('be.visible');

    // Get the initial scroll position and check it
    let initialScrollPosition;
    cy.window().then((win) => {
      initialScrollPosition = win.scrollY;
    });
    cy.scrollTo('top');
    cy.window().then((win) => {
      expect(win.scrollY).to.equal(0);
    });
    cy.get('[data-test="nav-logo-link"]').should('be.visible');

    // Footer validation
    cy.validateDomElementsAssertion('.filters-form__container');
  });

  it('Get different search elements and check them', function () {
    // Search by photographer (main element)
    cy.validateDomElementsAssertion('[data-test="search-input"]');

    // Search by a photograph name randomly
    cy.get('.photo-container > .z-10 > .ml-2 > [data-test="photographer-link"]')
      .eq('0')
      .invoke('text')
      .then((artistName) => {
        cy.get('[data-test="search-input"]')
          .click({ force: true })
          .clear()
          .type(artistName.trim()); // Use trim() to remove leading and trailing spaces
      });
    cy.wait(1000);

    // Ensure the correct artist name is shown
    cy.get('.photo-container > .z-10 > .ml-2 > [data-test="photographer-link"]')
      .eq('0')
      .invoke('text')
      .then((artistName) => {
        const normalizedArtistName = artistName.trim();
        cy.get('[data-test="photographer-link"]').each(($el, index, $list) => {
          cy.wrap($el)
            .invoke('text')
            .then((textValue) => {
              const retrieveArtistName = textValue.trim();
              if (normalizedArtistName === retrieveArtistName) {
                cy.log('Search is satisfied');
              } else {
                throw new Error(`Something went wrong ${index + 1}: ${retrieveArtistName}`);
              }
            });
        });
      });
    cy.visit('/', {
      failOnStatusCode: false,
      responseTimeout: 8000,
      followRedirect: true
    });

    // Assertion for: filter by color, filter by size & sort by
    cy.get('[data-test="filters-form-label"] > .text-lg');

    // Filter by size (up to px)
    cy.validateDomElementsAssertion('.filter-forms__dimension-inputs-container > .mt-2');
    cy.validateDomElementsAssertion('[data-test="dimension-input"]');

    // Ensure this filter works correctly
    cy.get('[data-test="dimension-input"]').eq(0).type(4160);
    cy.get('[data-test="dimension-input"]').eq(1).type(3000);
    cy.validateDomElementsAssertion('.photo-list-container').wait(2000);
    cy.get('[data-test="clear-filters-button"]').click({ force: true });

    // Sort by
    cy.validateDomElementsAssertion('[data-test="sort-dropdown"]');
    cy.get('[data-test="sort-dropdown"]:eq(0)').select('Photographer (a - z)', { force: true }).wait(2000);

    // Clear filters
    cy.validateDomElementsAssertion('[data-test="clear-filters-button"]');
    cy.get('[data-test="clear-filters-button"]').click();
    cy.get('[data-test="search-input"]').should('have.value', '');
    cy.get('[data-test="dimension-input"]').eq(0).should('have.value', '');
    cy.get('[data-test="dimension-input"]').eq(1).should('have.value', '');
  });

  it('Open one product randomly', function () {
    // API mocking
    cy.intercept({
      method: 'GET',
      url: '/api/photos/**',
    }).as('photoIdIsSet');

    // Get all the photo elements and open one randomly
    cy.get('.photo-container > [data-test="photo-details-link"]').then($imageToOpen => {
      const randomIndex = Math.floor(Math.random() * $imageToOpen.length);
      cy.wrap($imageToOpen[randomIndex]).click({ force: true }).wait(2000); // wait() is used only for demo purposes that you can see the test results
    });

    // Ensure there is no error on the new page and the image is properly opened
    cy.wait('@photoIdIsSet').its('response.statusCode').should('satisfy', statusCode => {
      return statusCode === 200 || statusCode === 304;
    });
    cy.url().should('match', /\/photos\/\d+/);

    // Photo details
    cy.validateDomElementsAssertion('.photo-details__image', '.capitalize', '.text-container');

    // Get pexels link and ensure the href is available and clickable
    cy.validateDomElementsAssertion('[data-test="photo-pexels-link"]');
    cy.get('[data-test="photo-pexels-link"]')
      .should('have.attr', 'href')
      .and('include', 'https://www.pexels.com/photo/') // Impossible to load the pexels link images directly because of HTTP 403
      .wait(1000);

    // Go back to the home page
    cy.validateDomElementsAssertion('.ml-1');
    cy.get('.ml-1').click({ force: true });
    cy.url().should('eq', Cypress.env("urlToTest"));
  });
});
