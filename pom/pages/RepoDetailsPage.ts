import { expect, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class RepoDetailsPage extends BasePage {

  private settingsButton: Locator = this.page.getByRole('link', { name: 'Settings' });
  private repoMainDescription: Locator = this.page.locator('.repo-description');
  private repoDescriptionInSettings: Locator = this.page.locator('#description');
  private privateLabel: Locator = this.page.locator('span.ui.basic.label.not-mobile',{ hasText: 'Private' });
  private templateLabel: Locator = this.page.locator('span.ui.basic.label.not-mobile',{ hasText: 'Template' });

  async waitForRepoPage(username: string, repoName: string) {
    await expect(this.page).toHaveURL(
      new RegExp(`/${username}/${repoName}$`)
    );
  }

  async checkDescriptionDisplayedForEmptyRepo(description: string) {
    await this.settingsButton.click();
    await expect(this.repoDescriptionInSettings).toHaveValue(description);
  }

  async checkDescriptionDisplayedForInitializedRepo(description: string) {
    await expect(this.repoMainDescription).toHaveText(description);
    await this.settingsButton.click();
    await expect(this.repoDescriptionInSettings).toHaveValue(description);
  }

  async checkPrivateLabelDisplayed() {
    await expect(this.privateLabel).toBeVisible();
  }

  async checkTemplateLabelDisplayed() {
    await expect(this.templateLabel).toBeVisible();
  }

  async checkLicenseLinksDisplayed(licenseName: string) {
    const licenseLink = this.page.getByRole('link', { name: licenseName });
    await expect(licenseLink).toBeVisible();
  }

  async checkGitignoreLinkDisplayed() {
    const gitignoreLink = this.page.getByRole('link', { name: '.gitignore' });
    await expect(gitignoreLink).toBeVisible();
  }
}
