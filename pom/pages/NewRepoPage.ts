import { expect, Locator } from "@playwright/test";
import BasePage from "./BasePage";
import { RepoData } from '../../uiModels/repo.model';
import { step } from "../../utils/decorators/step";


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


    @step('Assure owner is preselected: {username}')
    async assureCorrectOwnerPreselected(username: string) {
        await expect(this.ownerDropdown).toHaveText(username);
    }

    @step('Enter repository name: {repoName}')
    async enterRepoName(repoName: string) {
        await this.repoNameField.fill(repoName);
    }

    @step('Set repository private')
    async setRepoPrivate() {
        await this.visibilityCheckbox.check();
        await expect(this.visibilityCheckbox).toBeChecked();
    }

    @step('Enter repository description: {description}')
    async enterDescription(description: string) {
        await this.descriptionField.fill(description);
    }

    @step('Select repository template: {templateName}')
    async selectRepoTemplate(templateName: string) {
        await this.repoTemplateDropdown.click();

        const templateOption = this.repoTemplateDropdown.locator(`.item`, { hasText: templateName });
        await templateOption.waitFor({ state: 'visible', timeout: 5000 });;
        await templateOption.click();

        await expect(this.templateItemsSection).toBeVisible();
    }

    @step('Select template items: {items}')
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

    @step('Select issue labels: {issueLabelValue}')
    async selectIssueLabels(issueLabelValue: string) {
        await this.issueLabelDropdown.click();
        const labelOption = this.issueLabelDropdown.locator(`.item[data-value="${issueLabelValue}"]`)
        await labelOption.click();
    }

    @step('Select gitignore templates: {gitignoreTemplateNames}')
    async selectGitignoreTemplates(gitignoreTemplateNames: string[]) {
        await this.gitignoreDropdown.click();
        for (const gitignoreTemplateName of gitignoreTemplateNames) {
            await this.gitignoreDropdown.getByRole('option', { name: gitignoreTemplateName, exact: true }).click();
        }
        await expect(this.initializeWithReadmeCheckbox).toBeChecked();
        await this.page.locator('body').click({ position: { x: 0, y: 0 } });

    }

    @step('Select license template: {licenseTemplateName}')
    async selectLicenseTemplate(licenseTemplateName: string) {
        await this.licenseTemplateDropdown.click();
        await this.licenseTemplateDropdown.getByRole('option', { name: licenseTemplateName, exact: true }).click();
        await expect(this.initializeWithReadmeCheckbox).toBeChecked();

    }

    @step('Initialize repository with README')
    async initializeWithReadme() {
        await this.initializeWithReadmeCheckbox.check();
        await expect(this.initializeWithReadmeCheckbox).toBeChecked();
    }

    @step('Enter default branch name: {defaultBranchName}')
    async enterDefaultBranchName(defaultBranchName: string) {
        await this.defaultBranchNameField.fill(defaultBranchName);
    }

    @step('Set repository as template')
    async setTemplate() {
        await this.templateCheckbox.check();
        await expect(this.templateCheckbox).toBeChecked();
    }

    @step('Click Create Repository button')
    async clickCreateRepoButton() {
        await this.createRepoButton.click();

    }

    @step('Create repository with data: {data}')
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