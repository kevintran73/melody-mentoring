import { MailSlurp } from 'mailslurp-client';

const apiKey = Cypress.env('MAILSLURP_API_KEY');

Cypress.Commands.add('createInbox', () => {
  const mailslurp = new MailSlurp({ apiKey: apiKey });
  return mailslurp.createInbox();
});

Cypress.Commands.add('waitForEmail', (inboxId) => {
  const mailslurp = new MailSlurp({ apiKey: apiKey });
  return mailslurp.waitForLatestEmail(inboxId, 60000);
});
