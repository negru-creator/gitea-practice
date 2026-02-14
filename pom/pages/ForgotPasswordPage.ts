import BasePage from "./BasePage";

export default class ForgotPasswordPage extends BasePage {
    public url: string = 'user/forgot_password';


    public forgotPasswordHeader = this.page.locator('.attached.header', { hasText: 'Forgot Password' });
}