import LoginPage from '../../support/pages/login/login.page.js';

describe('Login-related tests', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should login with valid credentials successfully', () => {
    LoginPage
      .visit()
      .performValidLogin()
      .waitForPageLoad();
  });

  it('should fail login with wrong email', () => {
    LoginPage
      .visit()
      .performWrongEmailLogin()
      .waitForPageLoad();
  });

  it('should fail login with wrong password', () => {
    LoginPage
      .visit()
      .performWrongPasswordLogin()
      .waitForPageLoad();
  });

  it('should fail login with wrong credentials', () => {
    LoginPage
      .visit()
      .performWrongCredentialsLogin()
      .waitForPageLoad();
  });

});