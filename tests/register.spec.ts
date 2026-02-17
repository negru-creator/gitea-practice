import { test, expect } from '@playwright/test';
import RegisterPage from '../pom/pages/RegisterPage';
import { faker } from '@faker-js/faker/locale/en';
import DashboardPage from '../pom/pages/DashboardPage';
import { ErrorMessages } from '../test-data/messages/error-messages';
import { generateUniqueEmail } from '../utils/data-generation/emails';




test.describe('Registration Page tests', () => {
    let registerPage: RegisterPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        dashboardPage = new DashboardPage(page);
        await registerPage.navigateTo();
    });

    test('Successful registration', async () => {
        const randomUserName = faker.internet.username();
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(randomUserName, generateUniqueEmail(), randomPassword, randomPassword);
        await expect(dashboardPage.successRegistrationMessage).toBeVisible();
        await expect(dashboardPage.navBarUserName).toHaveText(randomUserName);

    });

    test('Registration with empty username', async ({ page }) => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register('', generateUniqueEmail(), randomPassword, randomPassword);
        await expect(registerPage.usernameField).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.usernameField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(registerPage.page).toHaveURL(registerPage.url);
    })


    test('Registration with empty email', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(faker.internet.username(), '', randomPassword, randomPassword);
        await expect(registerPage.emailField).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.emailField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(registerPage.page).toHaveURL(registerPage.url);
    })

    test('Registration with invalid email', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(faker.internet.username(), 'invalid-email', randomPassword, randomPassword);
        await expect(registerPage.emailField).toHaveJSProperty('validity.typeMismatch', true);
        await expect(registerPage.emailField).toHaveJSProperty('validationMessage', ErrorMessages.EMAIL_INVALID_MESSAGE);
        await expect(registerPage.page).toHaveURL(registerPage.url);
    });

    test('Registration with empty password', async () => {
        await registerPage.register(faker.internet.username(), generateUniqueEmail(), '', faker.internet.password({ length: 10 }));
        await expect(registerPage.passwordField).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.passwordField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(registerPage.page).toHaveURL(registerPage.url);
    })

    test('Registration with empty confirm password', async () => {
        await registerPage.register(faker.internet.username(), generateUniqueEmail(), faker.internet.password({ length: 10 }), '');
        await expect(registerPage.confirmPasswordField).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.confirmPasswordField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(registerPage.page).toHaveURL(registerPage.url);
    })

    test('Registration with non-matching passwords', async () => {
        const randomPassword = faker.internet.password({ length: 10 });
        await registerPage.register(faker.internet.username(), generateUniqueEmail(), randomPassword, randomPassword + '1');
        await expect(registerPage.notMatchingPasswordError).toBeVisible();
        await expect(registerPage.passwordField).toHaveCSS('border-color', 'rgb(224, 180, 180)');
        await expect(registerPage.confirmPasswordField).toHaveCSS('border-color', 'rgb(224, 180, 180)');
        await expect(registerPage.page).toHaveURL(registerPage.url);
    })

})
