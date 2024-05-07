describe('The login page', () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.visit(Cypress.env('frontend_test_server'));
  });

  it('should have a Sign-In with keycloak', () => {
    // Start from the index page
    let loginButton = cy.get('#login-button');

    loginButton.should('exist');
    loginButton.should('be.visible');
    cy.screenshot();
    loginButton.should('have.text', 'Sign-In with KeyCloak');
  });

  it('should show the keycloak default login page when clicking on the Sign-In with KeyCloak button', () => {
    // Start from the index page
    let loginButton = cy.get('#login-button');

    loginButton.should('exist');
    loginButton.should('be.visible');
    loginButton.should('have.text', 'Sign-In with KeyCloak');
    loginButton.click();
    cy.screenshot();
    cy.url().should(
      'include',
      'auth2.igad-health.eu/realms/regional-pandemic-analytics/protocol/openid-connect'
    );
  });

  it('should navigate to the home page after login', () => {
    // Start from the index page
    cy.get('#login-button').click();
    cy.get('#username').type(Cypress.env('test_user_username'));
    cy.get('#password').type(Cypress.env('test_user_password'));
    cy.get('#kc-login').click();
    cy.screenshot();
    // The new url should include "/home"
    cy.url().should('include', '/home');
  });

  after(() => {
    cy.visit(Cypress.env('frontend_test_server'));
  });
});
