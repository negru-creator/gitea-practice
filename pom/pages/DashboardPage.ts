import { step } from "../../utils/decorators/step";
import BasePage from "./BasePage";
import { Locator } from "@playwright/test";


export default class DashboardPage extends BasePage {
    public url: string = '/';
    public successRegistrationMessage: Locator = this.page.locator('.flash-success>p', { hasText: 'Account was successfully created. Welcome!' });
    public navBarUserName: Locator = this.page.locator('.gt-ellipsis').first();
    private createNewRepoButton: Locator = this.page.locator('[aria-label="New Repository"]');

    @step('Click Create New Repository button')
    public async clickCreateNewRepoButton() {
        await this.createNewRepoButton.click();
    }

}