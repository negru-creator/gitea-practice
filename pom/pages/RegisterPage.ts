import { Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class RegisterPage extends BasePage {
    public url: string = '/user/sign_up';

    public usernameField: Locator = this.page.locator('#user_name');
    public emailField: Locator = this.page.locator('#email');
    public passwordField: Locator = this.page.locator('#password');
    public confirmPasswordField: Locator = this.page.locator('#retype');
    private registerButton: Locator = this.page.locator('.ui.primary.button');
    public notMatchingPasswordError: Locator = this.page.locator('div.negative.message>p', { hasText: 'The passwords do not match.' });



    async enterUserName(userName: string) {
        await this.usernameField.fill(userName);
    }

    async enterEmail(email: string) {
        await this.emailField.fill(email);

    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);

    }

    async confirmPassword(confirmedPassword: string) {
        await this.confirmPasswordField.fill(confirmedPassword);

    }

    async clickRegisterButton() {
        await this.registerButton.click()
    }

    async register(userName: string, email: string, password: string, confirmedPassword: string) {
        await this.enterUserName(userName);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.confirmPassword(confirmedPassword);
        await this.clickRegisterButton();
    }


}