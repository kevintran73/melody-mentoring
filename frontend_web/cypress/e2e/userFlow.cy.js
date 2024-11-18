import 'cypress-file-upload';

context('UserFlow Test', () => {
  let studentEmail = 'cibalo7059@gianes.com';
  let studentName = 'TrueVictorStudent';
  let tutorEmail = 'tayera3936@inikale.com';
  let password = 'TestTestTest22!!';

  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  // Create a new student user
  it('registerUser', () => {
    cy.createInbox().then((inbox) => {
      // Register account details
      cy.contains('Register').click();

      const randomUsername = `Stu-${new Date().toISOString()}`;
      cy.get('#register-username').type(randomUsername);
      cy.get('#register-email').type(inbox.emailAddress);
      cy.get('#register-password').type('TestTestTest22!!');
      cy.contains('Sign up').click();

      // When directed to verification page, input code
      cy.waitForEmail(inbox.id).then((email) => {
        const confirmationCode = /Your confirmation code is (\d+)/.exec(
          email.body
        )[1];
        cy.log(confirmationCode);
        cy.get('[data-cy="codeInput"]').type(confirmationCode);
        cy.get('button').contains('Verify').click();

        // Login with new account
        cy.get('#login-email').type(inbox.emailAddress);
        cy.get('#login-password').type('TestTestTest22!!');
        cy.get('#login-go').click();

        // Logout
        cy.wait(500);
        cy.get('[data-cy="settings-button"]').click();
        cy.get('[data-cy="logout-button"]').click();
      });
    });
  });

  // Create experiment
  it('createExperiment', () => {
    cy.contains('Login').click();
    cy.get('#login-email').type(studentEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    // Navigate to create page, fill in all details and submit
    cy.get('[data-cy="create_button"]').click();
    cy.get('[data-cy="upload-thumbnail-button"]').attachFile(
      'Ode_to_Joy_Thumbnail.png'
    );

    cy.fixture('Ode_to_Joy_Easy.mxl', 'binary').then((fileContent) => {
      const fileName = 'Ode_to_Joy_Easy.mxl';
      const mimeType = 'application/vnd.recordare.musicxml';

      cy.get('[data-cy="upload-sheet-button"]').attachFile({
        fileContent,
        fileName,
        mimeType,
        encoding: 'binary',
      });
    });

    cy.get('#song-name-field').type(`S-${new Date().toISOString()}`);
    cy.get('#artist-field').type('Ludwig van Beethoven');

    cy.get('#select-instrument').click();
    cy.get('[data-cy="piano"]').click();

    cy.get('#difficulty-field').type('2');

    cy.get('#select-genre').click();
    cy.get('[data-cy="classical"]').click();

    cy.get('#submit-new-experiment-button').click();

    // Logout
    cy.wait(500);
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="logout-button"]').click();
  });

  // Upload track attempt and view
  it('uploadTrackAttempt', () => {
    cy.contains('Login').click();
    cy.get('#login-email').type(studentEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    cy.wait(4000);

    // Go to example song
    // cy.get('[data-cy="song-card-Ode to Joy (Test)"]', { timeout: 20000 })
    //   .first()
    //   .click();

    cy.contains('Ode to Joy (Test)').click();

    // Upload example song
    cy.contains('Upload a recording').click();
    cy.fixture('Ode_to_Joy_Easy.wav', 'binary').then((fileContent) => {
      const fileName = 'Ode_to_Joy_Easy.wav';
      const mimeType = 'audio/wav';

      cy.get('[data-cy="upload-audio-recording-button"]').attachFile({
        fileContent,
        fileName,
        mimeType,
        encoding: 'binary',
      });
    });
    cy.get('#upload-recording-go').click({ force: true });

    // Go to track attempt
    cy.get('[data-cy^="history-card-"]', { timeout: 200000 })
      .should('be.visible')
      .first()
      .click();

    // Logout
    cy.wait(500);
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="logout-button"]').click();
  });

  // Upload profile pic then upload default one back
  it('uploadProfilePic', () => {
    cy.contains('Login').click();
    cy.get('#login-email').type(studentEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    // Upload first profile picture
    cy.get('[data-cy="profile_button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="upload-profile-picture-button"]', {
      timeout: 5000,
    }).attachFile('Test_Profile_Pic.png');
    cy.contains('Confirm', { timeout: 2000 }).click();

    cy.reload();

    // Upload default profile picture back
    cy.wait(1000);
    cy.get('[data-cy="upload-profile-picture-button"]', {
      timeout: 2000,
    }).attachFile('Default_Profile_Pic.png');
    cy.contains('Confirm', { timeout: 2000 }).click();

    // Logout
    cy.wait(500);
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="logout-button"]').click();
  });

  // Request and accept a tutor
  it('findAndAcceptATutor', () => {
    cy.visit('http://localhost:3000/');
    cy.createInbox().then((inbox) => {
      cy.contains('Register').click();

      // Register a new tutor
      const randomUsername = `Tut-${new Date().toISOString()}`;
      cy.get('#register-username').type(randomUsername);
      cy.log(`Generated username: ${randomUsername}`);
      cy.get('#register-email').type(inbox.emailAddress);
      cy.get('#register-password').type('TestTestTest22!!');
      cy.get('#tutor-check').click();
      cy.contains('Sign up').click();

      cy.waitForEmail(inbox.id).then((email) => {
        const confirmationCode = /Your confirmation code is (\d+)/.exec(
          email.body
        )[1];
        cy.log(confirmationCode);
        cy.get('[data-cy="codeInput"]').type(confirmationCode);
        cy.get('button').contains('Verify').click();

        // Student sign in and request newly made tutor
        cy.wait(10000);
        cy.get('#login-email').type(studentEmail);
        cy.get('#login-password').type(password);
        cy.get('#login-go').click();

        cy.get('[data-cy="profile_button"]').click();
        cy.wait(10000);

        cy.contains('Find a Tutor').click();
        cy.wait(20000);

        cy.reload();
        cy.wait(10000);
        cy.contains('Find a Tutor').click();

        cy.wait(5000);
        cy.get('[data-cy="tutor-dialog-list"] li')
          .contains(randomUsername)
          .click();
        cy.contains('Confirm', { timeout: 5000 }).click();

        // Logout
        cy.wait(500);
        cy.get('[data-cy="settings-button"]').click();
        cy.get('[data-cy="logout-button"]').click();

        // Log in as tutor and go to students page

        cy.contains('Login').click();
        cy.get('#login-email').type(inbox.emailAddress);
        cy.get('#login-password').type('TestTestTest22!!');
        cy.get('#login-go').click();

        cy.get('[data-cy="students-button"]').click();

        cy.get(`[data-cy="student-confirm-${studentName}"]`).click();

        // Logout
        cy.wait(500);
        cy.get('[data-cy="settings-button"]').click();
        cy.get('[data-cy="logout-button"]').click();
      });
    });
  });

  // In a track attempt page, request a review and tutor accepts it, then view attempt in track summary page
  it('requestReviewForTrackSummary', () => {
    cy.contains('Login').click();
    cy.get('#login-email').type(studentEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    cy.get('[data-cy="history_button"]').click();

    // Select tutor and ask for review
    cy.get('[data-cy^="history-card-"]', { timeout: 20000 })
      .should('be.visible')
      .first()
      .click();

    cy.wait(5000);

    cy.get('[data-cy="request-review-button"]').click();

    cy.get('[data-cy="request-dialog-list"] li', { timeout: 3000 })
      .contains('TeacherVictor')
      .click();

    cy.contains('Confirm').click();

    // Logout
    cy.wait(500);
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="logout-button"]').click();

    // Send review on track attempt
    cy.contains('Login').click();
    cy.get('#login-email').type(tutorEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    cy.get('[data-cy^="student-request-"]', { timeout: 20000 })
      .should('be.visible')
      .first()
      .click();

    cy.get('[data-cy="review-field"]').type(
      'That was a pretty good review. Keep it up!'
    );

    cy.contains('Send Review').click();

    // Logout
    cy.wait(500);
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="logout-button"]').click();

    // Log back into student to view new review
    cy.wait(200);
    cy.contains('Login').click();
    cy.wait(200);
    cy.get('#login-email').type(studentEmail);
    cy.get('#login-password').type(password);
    cy.get('#login-go').click();

    cy.get('[data-cy="history_button"]').click();

    cy.get('[data-cy^="history-card-"]', { timeout: 20000 })
      .should('be.visible')
      .first()
      .click();

    // Logout
    cy.wait(500);
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="logout-button"]').click();
  });
});
