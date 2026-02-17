import { expect, Locator } from "@playwright/test";
import BasePage from "./BasePage";
import { step } from "../../utils/decorators/step";

export default class RepoDetailsPage extends BasePage {

  private settingsButton: Locator = this.page.getByRole('link', { name: 'Settings' });
  private repoMainDescription: Locator = this.page.locator('.repo-description');
  private repoDescriptionInSettings: Locator = this.page.locator('#description');
  private privateLabel: Locator = this.page.locator('span.ui.basic.label.not-mobile', { hasText: 'Private' });
  private templateLabel: Locator = this.page.locator('span.ui.basic.label.not-mobile', { hasText: 'Template' });

  @step('Wait for repository page for user: {username}, repo: {repoName}')
  async waitForRepoPage(username: string, repoName: string) {
    await expect(this.page).toHaveURL(
      new RegExp(`/${username}/${repoName}$`)
    );
  }

  @step('Check description displayed for empty repository: {description}')
  async checkDescriptionDisplayedForEmptyRepo(description: string) {
    await this.settingsButton.click();
    await expect(this.repoDescriptionInSettings).toHaveValue(description);
  }

  @step('Check description displayed for initialized repository: {description}')
  async checkDescriptionDisplayedForInitializedRepo(description: string) {
    await expect(this.repoMainDescription).toHaveText(description);
    await this.settingsButton.click();
    await expect(this.repoDescriptionInSettings).toHaveValue(description);
  }

  @step('Check private label is displayed')
  async checkPrivateLabelDisplayed() {
    await expect(this.privateLabel).toBeVisible();
  }

  @step('Check template label is displayed')
  async checkTemplateLabelDisplayed() {
    await expect(this.templateLabel).toBeVisible();
  }

  @step('Check license link is displayed: {licenseName}')
  async checkLicenseLinksDisplayed(licenseName: string) {
    const licenseLink = this.page.getByRole('link', { name: licenseName });
    await expect(licenseLink).toBeVisible();
  }

  @step('Check .gitignore link is displayed')
  async checkGitignoreLinkDisplayed() {
    const gitignoreLink = this.page.getByRole('link', { name: '.gitignore' });
    await expect(gitignoreLink).toBeVisible();
  }
}
