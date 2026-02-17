import { expect, Locator } from "@playwright/test";
import BasePage from "./BasePage";
import { RepoData } from '../../models/repo.model';


export default class NewRepoPage extends BasePage {
    public url: string = '/repo/create';
    public newRepoHeader: Locator = this.page.locator('.attached.header', { hasText: 'New Repository' });
    public repoNameField: Locator = this.page.locator('#repo_name');
    private ownerDropdown: Locator = this.page.locator('#repo_owner_dropdown > span');
    private visibilityCheckbox: Locator = this.page.locator('input[name="private"]');
    private descriptionField: Locator = this.page.locator('#description');
    private repoTemplateDropdown: Locator = this.page.locator('#repo_template_search');
    private templateItemsSection = this.page.locator('.field', { hasText: 'Template Items' });
    public missingTemplateItem = this.page.locator('.flash-error>p', { hasText: 'Must select at least one template item' });
    private issueLabelDropdown: Locator = this.page.locator('.ui.search.selection.dropdown').nth(1);
    private gitignoreDropdown: Locator = this.page.locator('.ui.search.selection.dropdown').nth(2);
    private licenseTemplateDropdown: Locator = this.page.locator('.ui.search.selection.dropdown').nth(3);
    public initializeWithReadmeCheckbox: Locator = this.page.locator('input[name="auto_init"]');
    private defaultBranchNameField: Locator = this.page.locator('#default_branch');
    private templateCheckbox: Locator = this.page.locator('input[name="template"]');
    private createRepoButton: Locator = this.page.locator('.ui.primary.button', { hasText: 'Create Repository' });


    async assureCorrectOwnerPreselected(username: string) {
        await expect(this.ownerDropdown).toHaveText(username);
    }

    async enterRepoName(repoName: string) {
        await this.repoNameField.fill(repoName);
    }

    async setRepoPrivate() {
        await this.visibilityCheckbox.check();
        await expect(this.visibilityCheckbox).toBeChecked();
    }

    async enterDescription(description: string) {
        await this.descriptionField.fill(description);
    }

    async selectRepoTemplate(templateName: string) {
        await this.repoTemplateDropdown.click();

        const templateOption = this.repoTemplateDropdown.locator(`.item`, { hasText: templateName });
        await templateOption.waitFor({ state: 'visible' });
        await templateOption.click();

        await expect(this.templateItemsSection).toBeVisible();
    }

    async selectTemplateItems(items: string[]) {
        if (!items.length) throw new Error('At least one template item must be selected');
        for (const item of items) {
            const checkbox = this.page.locator(`[name="${item}"]`);
            await checkbox.waitFor({ state: 'visible' });
            if (!(await checkbox.isChecked())) {
                await checkbox.check();
            }
            await expect(checkbox).toBeChecked();
        }
    }

    async selectIssueLabels(issueLabelValue: string) {
        await this.issueLabelDropdown.click();
        const labelOption = this.issueLabelDropdown.locator(`.item[data-value="${issueLabelValue}"]`)
        await labelOption.click();
    }

    async selectGitignoreTemplates(gitignoreTemplateNames: string[]) {
        await this.gitignoreDropdown.click();
        for (const gitignoreTemplateName of gitignoreTemplateNames) {
            await this.gitignoreDropdown.getByRole('option', { name: gitignoreTemplateName, exact: true }).click();
        }
        await expect(this.initializeWithReadmeCheckbox).toBeChecked();
        await this.page.locator('body').click({ position: { x: 0, y: 0 } });

    }

    async selectLicenseTemplate(licenseTemplateName: string) {
        await this.licenseTemplateDropdown.click();
        await this.licenseTemplateDropdown.getByRole('option', { name: licenseTemplateName, exact: true }).click();
        await expect(this.initializeWithReadmeCheckbox).toBeChecked();

    }

    async initializeWithReadme() {
        await this.initializeWithReadmeCheckbox.check();
        await expect(this.initializeWithReadmeCheckbox).toBeChecked();
    }

    async enterDefaultBranchName(defaultBranchName: string) {
        await this.defaultBranchNameField.fill(defaultBranchName);
    }

    async setTemplate() {
        await this.templateCheckbox.check();
        await expect(this.templateCheckbox).toBeChecked();
    }

    async clickCreateRepoButton() {
        await this.createRepoButton.click();

    }

    async createRepository(data: RepoData) {
        await this.enterRepoName(data.repoName);
        if (data.isPrivate) {
            await this.setRepoPrivate();
        }
        if (data.description) {
            await this.enterDescription(data.description);
        }
        if (data.repoTemplateName) {
            await this.selectRepoTemplate(data.repoTemplateName);

            if (data.templateItems?.length) {
                await this.selectTemplateItems(data.templateItems);
            }
        }
        if (data.labels) {
            await this.selectIssueLabels(data.labels);
        }
        if (data.gitignoresTemplate && data.gitignoresTemplate.length > 0) {
            await this.selectGitignoreTemplates(data.gitignoresTemplate);
        }
        if (data.licenseTemplate) {
            await this.selectLicenseTemplate(data.licenseTemplate);
        }
        if (data.isInitialized) {
            await this.initializeWithReadme();
        }
        if (data.defaultBranchName) {
            await this.enterDefaultBranchName(data.defaultBranchName);
        }
        if (data.isTemplate) { await this.setTemplate(); }
        await this.createRepoButton.click();
    }

}