describe('The My Pipelines page', () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.visit(Cypress.env('frontend_test_server'));
    cy.get('#login-button').click();
    cy.get('#username').type(Cypress.env('test_user_username'));
    cy.get('#password').type(Cypress.env('test_user_password'));
    cy.get('#kc-login').click();
    cy.wait(1000);
    cy.visit(Cypress.env('frontend_test_server') + 'pipelines');
    cy.url().should('include', '/pipelines');
  });

  // it('should show the My Pipelines page when user click on the My Pipelines section', () => {
  //   // cy.get('a').each(($el) => {
  //   //   const href = $el.attr('href');
  //   //   if (href === '/pipelines') {
  //   //     cy.visit(Cypress.env('frontend_test_server') + 'pipelines');
  //   //     cy.url().should('include', '/pipelines');
  //   //   }
  //   // });
  // });

  it('should have a Create Pipeline button', () => {
    let createPipelineButton = cy.get('#createPipelineButton');
    createPipelineButton.should('exist');
    createPipelineButton.should('be.visible');
    createPipelineButton.should('have.text', 'Create Pipeline');
    cy.screenshot();
  });

  it('should have an Upload Pipeline button', () => {
    let uploadPipelineButton = cy.get('#uploadPipelineButton');
    uploadPipelineButton.should('exist');
    uploadPipelineButton.should('be.visible');
    uploadPipelineButton.should('have.text', 'Upload Pipeline');
    cy.screenshot();
  });

  it('should have a View Pipeline button', () => {
    let viewPipelineButton = cy.get('#viewPipelineButton');
    viewPipelineButton.should('exist');
    viewPipelineButton.should('be.visible');
    viewPipelineButton.should('have.text', 'View');
    cy.screenshot();
  });

  it('should view the correct pipeline when clicking on View button', () => {
    let viewPipelineButton = cy.get('#viewPipelineButton');
    viewPipelineButton.click();
    // Actively waiting as the iframe takes time to load
    cy.wait(4000);
    cy.get('iframe').should('exist');
    cy.screenshot();
  });

  it('should have a Download Pipeline icon', () => {
    let downloadPipelineButton = cy.get('#downloadPipelineButton');
    downloadPipelineButton.should('exist');
    downloadPipelineButton.should('be.visible');
    cy.screenshot();
  });
});
