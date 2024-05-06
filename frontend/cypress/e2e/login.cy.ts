import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

describe('The login page', () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.visit('https://home2.igad-health.eu/');
  });

  it('should have a Sign-In with keycloak', () => {
    // Start from the index page
    let loginButton = cy.get('#login-button');

    loginButton.should('exist');
    loginButton.should('be.visible');
    loginButton.should('have.text', 'Sign-In with Keycloak');
  });

  it('should navigate to the home page after login', () => {
    // Start from the index page
    cy.get('#login-button').click();
    cy.get('#username').type(publicRuntimeConfig.NEXT_TEST_USER_USERNAME);
    cy.get('#password').type(publicRuntimeConfig.NEXT_TEST_USER_PASSWORD);
    cy.get('#kc-login').click();

    // The new url should include "/home"
    cy.url().should('include', '/home');
  });
});
