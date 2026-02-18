import { step } from "../../utils/decorators/step";
import BasePage from "./BasePage";
import { Locator } from "@playwright/test";

export default class UserSettingsPage extends BasePage {
    public url: string = '/user/settings';

    private applicationsTab: Locator = this.page.locator('[href="/user/settings/applications"]');
    private tokenNameInput: Locator = this.page.locator('#name');
    private permissionCheckbox: Locator = this.page.locator('[value^="write:"]');
    private generateTokenButton: Locator = this.page.locator('button:has-text("Generate Token ")');
    private generatedTokenMessage: Locator = this.page.locator('.info.message > p');

    @step('Navigate to applications tab')
    public async navigateToApplicationsTab() {
        await this.applicationsTab.click();
    }

    @step('Generate new token with all permissions')
    public async generateNewToken(tokenName: string) {
        await this.tokenNameInput.fill(tokenName);
        for (const checkbox of await this.permissionCheckbox.all()) {
            await checkbox.check();
        }
        await this.generateTokenButton.click();
        return await this.generatedTokenMessage.innerText();
    }
}