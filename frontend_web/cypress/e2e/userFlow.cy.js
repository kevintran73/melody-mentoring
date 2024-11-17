import 'cypress-file-upload';

context('UserFlow Test', () => {
  let studentEmail = 'cibalo7059@gianes.com';
  let tutorEmail = 'tayera3936@inikale.com';
  let password = 'TestTestTest22!!';

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

  // it('createExperiment', () => {
  //   cy.contains('Login').click();
  // cy.get('#login-email').type(studentEmail);
  // cy.get('#login-password').type(password);
  //   cy.get('#login-go').click();

  //   cy.get('[data-cy="create_button"]').click();

  //   cy.get('[data-cy="upload-thumbnail-button"]').attachFile(
  //     'Ode_to_Joy_Thumbnail.png'
  //   );

  //   cy.fixture('Ode_to_Joy_Easy.mxl', 'binary').then((fileContent) => {
  //     const fileName = 'Ode_to_Joy_Easy.mxl';
  //     const mimeType = 'application/vnd.recordare.musicxml';

  //     cy.get('[data-cy="upload-sheet-button"]').attachFile({
  //       fileContent,
  //       fileName,
  //       mimeType,
  //       encoding: 'binary',
  //     });
  //   });

  //   cy.get('#song-name-field').type(`S-${new Date().toISOString()}`);
  //   cy.get('#artist-field').type('Ludwig van Beethoven');

  //   cy.get('#select-instrument').click();
  //   cy.get('[data-cy="piano"]').click();

  //   cy.get('#difficulty-field').type('2');

  //   cy.get('#select-genre').click();
  //   cy.get('[data-cy="classical"]').click();

  //   cy.get('#submit-new-experiment-button').click();
  // });

  // it('uploadTrackAttempt', () => {
  //   cy.contains('Login').click();
  // cy.get('#login-email').type(studentEmail);
  // cy.get('#login-password').type(password);
  //   cy.get('#login-go').click();

  //   cy.wait(2500);

  //   cy.get(`[data-cy="Ode to Joy (Test)"]`).first().click();

  //   cy.contains('Upload a recording').click();

  //   cy.get('[data-cy="upload-audio-recording-button"]').attachFile(
  //     'Ode_to_Joy_Easy.wav'
  //   );

  //   cy.get('#upload-recording-go').click({ force: true });
  // });

  // it('uploadProfilePic', () => {
  //   cy.contains('Login').click();
  // cy.get('#login-email').type(studentEmail);
  // cy.get('#login-password').type(password);
  //   cy.get('#login-go').click();

  //   cy.get('[data-cy="profile_button"]').click();

  //   cy.wait(2000);

  //   cy.get('[data-cy="upload-profile-picture-button"]').attachFile(
  //     'Test_Profile_Pic.png'
  //   );

  //   cy.wait(100);

  //   cy.contains('Confirm').click();

  //   cy.reload();

  //   cy.wait(2000);

  //   cy.get('[data-cy="upload-profile-picture-button"]').attachFile(
  //     'Default_Profile_Pic.png'
  //   );

  //   cy.wait(100);

  //   cy.contains('Confirm').click();
  // });

  // it('findAndAcceptATutor', () => {
  //   cy.contains('Login').click();
  //   cy.get('#login-email').type(studentEmail);
  //   cy.get('#login-password').type(password);
  //   cy.get('#login-go').click();

  //   cy.get('[data-cy="profile_button"]').click();

  //   cy.wait(2000);

  //   cy.contains('Find a Tutor').click();

  //   cy.get('[data-cy="tutor-dialog-list"] li')
  //     .contains('TeacherVictor')
  //     .click();
  // });

  it('reviewTrackSummary', () => {
    cy.contains('Login').click();
    cy.get('#login-email').type(studentEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    cy.get('[data-cy="history_button"]').click();

    cy.wait(10000);

    // cy.get('[data-cy^="history-card-"]').first().click();
    cy.get('[data-cy="history-card-1"]').should('exist').first().click();
    // cy.get('[data-cy]').then((elements) => {
    //   console.log(elements);
    // });
  });
});
