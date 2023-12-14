/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("getByDataTest", (selector, ...args) => {
  return cy.get(`[data-test=${selector}`, ...args)
})

/**
 * @author      <shahin.rastgar@gmail.com>
 * @copyright   Copyright (c) ShahinR
 * @license     Proprietary
 */

Cypress.Commands.add('callFrontOffice', (front) => {
  cy.request({
    url: '/',
    failOnStatusCode: true, // Enforce failing the test on non-2xx responses
    followRedirect: true,
    timeout: 10000,
  }).then((response) => {
    expect(response.status).to.eq(200)

    // If the request === HTTP 200 then visit the home page
    if (response.status === 200) {
      cy.visit('/', {
        failOnStatusCode: false,
        responseTimeout: 8000,
        followRedirect: true
      })
      cy.url().should('contain', '/localhost')
    }
  })
})

Cypress.Commands.add("waitForFullyLoad", () => {
  cy.get("body", { timeout: 10000 }).should("have.length", 1)
})

Cypress.Commands.add('chaiAssertion', (chaiAssertion) => {
  // Chai library insertion
  var chai = require('chai')
  var assert = chai.assert    // Using Assert style
  var expect = chai.expect    // Using Expect style
  var should = chai.should()  // Using Should style
})

Cypress.Commands.add("validateDomElementsAssertion", function ($elem) {
  cy.get($elem, { timeout: 30000 })
    .should('exist')
    .should('be.visible', 'text-decoration')
    .and("have.length.at.least", 1)
})

Cypress.Commands.add('IgnoreJSUncaughtExceptions', (IgnoreJSUncaughtExceptions) => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
})

