import { Locator } from "@playwright/test";
import BasePage from "./BasePage";
import { step } from "../../utils/decorators/step";

export default class RegisterPage extends BasePage {
    public url: string = '/user/sign_up';

    public usernameField: Locator = this.page.locator('#user_name');
    public emailField: Locator = this.page.locator('#email');
    public passwordField: Locator = this.page.locator('#password');
    public confirmPasswordField: Locator = this.page.locator('#retype');
    private registerButton: Locator = this.page.locator('.ui.primary.button');
    public notMatchingPasswordError: Locator = this.page.locator('div.negative.message>p', { hasText: 'The passwords do not match.' });



    @step('Enter username: {userName}')
    async enterUserName(userName: string) {
        await this.usernameField.fill(userName);
    }

    @step('Enter email: {email}')
    async enterEmail(email: string) {
        await this.emailField.fill(email);

    }

    @step('Enter password: {password}')
    async enterPassword(password: string) {
        await this.passwordField.fill(password);

    }

    @step('Enter confirmed password: {confirmedPassword}')
    async confirmPassword(confirmedPassword: string) {
        await this.confirmPasswordField.fill(confirmedPassword);

    }

    @step('Click the Register button')
    async clickRegisterButton() {
        await this.registerButton.click()
    }

    @step('Register with username: {userName}, email: {email}, password: {password}, confirmed password: {confirmedPassword}')
    async register(userName: string, email: string, password: string, confirmedPassword: string) {
        await this.enterUserName(userName);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.confirmPassword(confirmedPassword);
        await this.clickRegisterButton();
    }


}