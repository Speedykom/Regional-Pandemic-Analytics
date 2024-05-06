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
    loginButton.should('have.text', 'Sign-In with KeyCloak');
    cy.log('**username:** ' + Cypress.env('test_user_username'));
    cy.log('**password:** ' + Cypress.env('test_user_password'));

    // save a screenshot of the test runner
    // to show what the env values were
    cy.screenshot('env', { capture: 'runner' });
  });

  // it('should navigate to the home page after login', () => {
  //   // Start from the index page
  //   cy.get('#login-button').click();
  //   cy.get('#username').type(Cypress.env('test_user_username'));
  //   cy.get('#password').type(Cypress.env('test_user_password'));
  //   cy.get('#kc-login').click();

  //   // The new url should include "/home"
  //   cy.url().should('include', '/home');
  // });
  // afterEach(() => {});
});
