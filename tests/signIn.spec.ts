import { ErrorMessages } from "../test-data/messages/error-messages";
import { test, expect } from "../utils/fixtures/pages";
import testUser1Data from '../test-data/users-data/testUser1.json';


test.describe('Sign In Tests', () => {
    const testUserName = testUser1Data.testUserName;
    const testEmail = testUser1Data.testEmail;
    const testPassword = testUser1Data.testPassword;

    test('Sign In with valid username and password', async ({ signInPage, dashboardPage }) => {
        await signInPage.signIn(testUserName, testPassword);
        await expect(dashboardPage.navBarUserName).toHaveText(testUserName);
        await expect(dashboardPage.page).toHaveURL(dashboardPage.url);
    })
    test('Sign In with valid email and password', async ({ signInPage, dashboardPage }) => {
        await signInPage.signIn(testEmail, testPassword);
        await expect(dashboardPage.navBarUserName).toHaveText(testUserName);
        await expect(dashboardPage.page).toHaveURL(dashboardPage.url);
    })
    test('Sign In with "Remember this device" option selected', async ({ signInPage, dashboardPage }) => {
        await signInPage.signIn(testUserName, testPassword, true);
        await expect(dashboardPage.navBarUserName).toHaveText(testUserName);
        await expect(dashboardPage.page).toHaveURL(dashboardPage.url);
    })

    test('Sign In with empty username', async ({ signInPage }) => {
        await signInPage.signIn('', testPassword);
        await expect(signInPage.usernameOrEmailField).toHaveJSProperty('validity.valueMissing', true);
        await expect(signInPage.usernameOrEmailField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with empty password', async ({ signInPage }) => {
        await signInPage.signIn(testUserName, '');
        await expect(signInPage.passwordField).toHaveJSProperty('validity.valueMissing', true);
        await expect(signInPage.passwordField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with invalid username', async ({ signInPage }) => {
        await signInPage.signIn('invalidUsername', testPassword);
        await expect(signInPage.incorrectCredsError).toBeVisible();
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with invalid email', async ({ signInPage }) => {
        await signInPage.signIn('invalidEmail@invalid.com', testPassword);
        await expect(signInPage.incorrectCredsError).toBeVisible();
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with invalid password', async ({ signInPage }) => {
        await signInPage.signIn(testUserName, 'invalidPassword');
        await expect(signInPage.incorrectCredsError).toBeVisible();
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })
    test('Click on "Forgot password?" link', async ({ signInPage, forgotPasswordPage }) => {
        await signInPage.clickForgotPasswordLink();
        await expect(signInPage.page).toHaveURL(forgotPasswordPage.url);
        await expect(forgotPasswordPage.forgotPasswordHeader).toBeVisible();
    })
    test('Click on "Sign In with OpenID" button', async ({ signInPage, openIdLoginPage }) => {
        await signInPage.clickSignInWithOpenIDButton();
        await expect(signInPage.page).toHaveURL(openIdLoginPage.url);
        await expect(openIdLoginPage.openIdHeader).toBeVisible();
        await expect(openIdLoginPage.openIdField).toBeVisible();
    })

})
