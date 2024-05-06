// describe('The My Pipelines page', () => {
//   before(() => {
//     cy.kcLogout();
//     cy.visit(Cypress.env('frontend_test_server'), { timeout: 10000 });
//     cy.get('#login-button').click();
//     cy.get('#username').type(Cypress.env('test_user_username'));
//     cy.get('#password').type(Cypress.env('test_user_password'));
//     cy.get('#kc-login').click();
//   });
//   beforeEach(() => {
//     cy.screenshot({ timeout: 10000 });
//   });

//   it('should show the My Pipelines page when user click on the My Pipelines section', () => {
//     cy.get('<a>').click();
//     cy.get('a').each(($el) => {
//       const href = $el.attr('href');
//       if (href === '/pipelines') {
//         cy.visit(href);
//         cy.title().should('include', '/pipelines');
//         cy.screenshot();
//       }
//     });
//   });
// });
