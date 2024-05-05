describe('The login page', () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.visit('https://home2.igad-health.eu/');
  });
  it('should navigate to the home page after login', () => {
    // Start from the index page
    cy.get('#login-button').click();
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('#kc-login').click();

    // The new url should include "/home"
    cy.url().should('include', '/home');
  });
});
