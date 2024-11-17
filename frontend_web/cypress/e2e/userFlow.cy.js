import 'cypress-file-upload';

context('UserFlow Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  // it('createUser', () => {
  //   cy.visit('http://localhost:3000/');
  //   cy.createInbox().then((inbox) => {
  //     cy.contains('Register').click();

  //     const randomUsername = `User-${new Date().toISOString()}`;
  //     cy.get('#register-username').type(randomUsername);
  //     cy.get('#register-email').type(inbox.emailAddress);
  //     cy.get('#register-password').type('TestTestTest22!!');
  //     cy.contains('Sign up').click();

  //     cy.waitForEmail(inbox.id).then((email) => {
  //       const confirmationCode = /Your confirmation code is (\d+)/.exec(
  //         email.body
  //       )[1];
  //       cy.log(confirmationCode);
  //       cy.get('[data-cy="codeInput"]').type(confirmationCode);
  //       cy.get('button').contains('Verify').click();

  //       cy.get('#login-email').type(inbox.emailAddress);
  //       cy.get('#login-password').type('TestTestTest22!!');
  //       cy.get('#login-go').click();
  //     });
  //   });
  // });

  it('createExperiment', () => {
    cy.contains('Login').click();
    cy.get('#login-email').type('cibalo7059@gianes.com');
    cy.get('#login-password').type('TestTestTest22!!');
    cy.get('#login-go').click();

    cy.get('[data-cy="create_button"]').click();

    // cy.get('#song-name-field').type('Ode to Joy (Easy)');
    // cy.get('#artist-field').type('Ludwig van Beethoven');

    // cy.get('#select-instrument').click();
    // cy.get('[data-cy="piano"]').click();

    // cy.get('#difficulty-field').type('2');

    // cy.get('#select-genre').click();
    // cy.get('[data-cy="classical"]').click();

    // cy.get('#upload-thumbnail-button')
    //   .invoke('show')
    //   .attachFile('Ode_to_Joy_Thumbnail.png');

    cy.get('[data-cy="upload-thumbnail-button"]').click();

    // cy.get('[data-cy="upload-thumbnail-button"]')
    //   .invoke('show')
    //   .attachFile('Ode_to_Joy_Thumbnail.png');
    // cy.get('input[type="file"]').attachFile('Ode_to_Joy_Thumbnail.png');

    // cy.get('#upload-sheet-button').click();
    // cy.get('input[type="file"]').attachFile('Ode_to_Joy_Easy.mxl');

    // cy.get('#submit-new-experiment-button').click();
  });
});
