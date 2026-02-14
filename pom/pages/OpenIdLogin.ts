import { Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class OpenIdLogin extends BasePage {
    public url: string = 'user/login/openid';
    public openIdField: Locator = this.page.locator('#openid');
    public openIdHeader: Locator = this.page.locator('.attached.header.center', { hasText: 'OpenID' });

}