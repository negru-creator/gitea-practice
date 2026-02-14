import test, { expect } from "@playwright/test";
import SignInPage from "../pom/pages/SignInPage";
import OpenIdLogin from "../pom/pages/OpenIdLoginPage";
import DashboardPage from "../pom/pages/DashboardPage";
import { ErrorMessages } from "../test-data/messages/error-messages";
import ForgotPasswordPage from "../pom/pages/ForgotPasswordPage";
import { validUser } from "../test-data/users-data/users";



test.describe('Sign In Tests', () => {
    let signInPage: SignInPage;
    let openIdLogin: OpenIdLogin;
    let dashboardPage: DashboardPage;
    let forgetPasswordPage: ForgotPasswordPage;
    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        openIdLogin = new OpenIdLogin(page);
        dashboardPage = new DashboardPage(page);
        forgetPasswordPage = new ForgotPasswordPage(page);
        await signInPage.navigateTo();
    });
    test('Sign In with valid username and password', async () => {
        await signInPage.signIn(validUser.username, validUser.password);
        await expect(dashboardPage.navBarUserName).toHaveText(validUser.username);
        await expect(dashboardPage.page).toHaveURL(dashboardPage.url);
    })
    test('Sign In with valid email and password', async () => {
        await signInPage.signIn(validUser.email, validUser.password);
        await expect(dashboardPage.navBarUserName).toHaveText(validUser.username);
        await expect(dashboardPage.page).toHaveURL(dashboardPage.url);
    })
    test('Sign In with "Remember this device" option selected', async () => {
        await signInPage.signIn(validUser.username, validUser.password, true);
        await expect(dashboardPage.navBarUserName).toHaveText(validUser.username);
        await expect(dashboardPage.page).toHaveURL(dashboardPage.url);
    })

    test('Sign In with empty username', async () => {
        await signInPage.signIn('', validUser.password);
        await expect(signInPage.usernameOrEmailField).toHaveJSProperty('validity.valueMissing', true);
        await expect(signInPage.usernameOrEmailField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with empty password', async () => {
        await signInPage.signIn(validUser.username, '');
        await expect(signInPage.passwordField).toHaveJSProperty('validity.valueMissing', true);
        await expect(signInPage.passwordField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with invalid username', async () => {
        await signInPage.signIn('invalidUsername', validUser.password);
        await expect(signInPage.incorrectCredsError).toBeVisible();
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with invalid email', async () => {
        await signInPage.signIn('invalidEmail@invalid.com', validUser.password);
        await expect(signInPage.incorrectCredsError).toBeVisible();
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })

    test('Sign In with invalid password', async () => {
        await signInPage.signIn(validUser.username, 'invalidPassword');
        await expect(signInPage.incorrectCredsError).toBeVisible();
        await expect(signInPage.page).toHaveURL(signInPage.url);
    })
    test('Click on "Forgot password?" link', async () => {
        await signInPage.clickForgotPasswordLink();
        await expect(signInPage.page).toHaveURL(forgetPasswordPage.url);
        await expect(forgetPasswordPage.forgotPasswordHeader).toBeVisible();
    })
    test('Click on "Sign In with OpenID" button', async () => {
        await signInPage.clickSignInWithOpenIDButton();
        await expect(signInPage.page).toHaveURL(openIdLogin.url);
        await expect(openIdLogin.openIdHeader).toBeVisible();
        await expect(openIdLogin.openIdField).toBeVisible();
    })

})
