import { expect, Locator } from "@playwright/test";
import BasePage from "./BasePage";
import { step } from "../../utils/decorators/step";

export default class SignInPage extends BasePage {
    public url: string = 'user/login';
    public usernameOrEmailField: Locator = this.page.locator('#user_name');
    public passwordField: Locator = this.page.locator('#password');
    private signInButton: Locator = this.page.locator('.ui.primary.button');
    public rememberDeviceCheckbox: Locator = this.page.locator('input[name="remember"]');
    private signInWithOpenIDButton: Locator = this.page.locator('.openid');
    public incorrectCredsError: Locator = this.page.locator('div.negative.message>p', { hasText: 'Username or password is incorrect.' });
    private forgotPasswordLink: Locator = this.page.locator('text=Forgot password?');


    @step('Sign in with username or email: {usernameOrEmail}, password: {password}, remember device: {rememberDevice}')
    async signIn(usernameOrEmail: string, password: string, rememberDevice: boolean = false) {
        await this.usernameOrEmailField.fill(usernameOrEmail);
        await this.passwordField.fill(password);
        if (rememberDevice) {
            await this.rememberDeviceCheckbox.check();
            await expect(this.rememberDeviceCheckbox).toBeChecked();
        }
        await this.signInButton.click();
    }

    @step('Click Sign in with OpenID button')
    async clickSignInWithOpenIDButton() {
        await this.signInWithOpenIDButton.click();
    }

    @step('Click Forgot password link')
    async clickForgotPasswordLink() {
        await this.forgotPasswordLink.click();
    }
}
