import { test, expect } from '@playwright/test';
import DashboardPage from '../pom/pages/DashboardPage';
import NewRepoPage from '../pom/pages/NewRepo';
import SignInPage from '../pom/pages/SignInPage';
import { validUser } from '../test-data/users-data/users';
import { faker } from '@faker-js/faker/locale/en';
import RepoDetailsPage from '../pom/pages/RepoDetailsPage';
import { ErrorMessages } from '../test-data/messages/error-messages';


test.describe('Create new repository', () => {
    let dashboardPage: DashboardPage;
    let newRepoPage: NewRepoPage;
    let signInPage: SignInPage;
    let repoDetailsPage: RepoDetailsPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        newRepoPage = new NewRepoPage(page);
        signInPage = new SignInPage(page);
        repoDetailsPage = new RepoDetailsPage(page);
        await signInPage.navigateTo();
        await signInPage.signIn(validUser.username, validUser.password);
        await dashboardPage.clickCreateNewRepoButton();
        await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
        await expect(newRepoPage.newRepoHeader).toBeVisible();
    });

    test('Create repo with only repo name', async () => {
        const repoName = faker.lorem.word();
        await newRepoPage.createRepository({ repoName });
        await repoDetailsPage.waitForRepoPage(validUser.username, repoName);
    });

    test('Create repo fails without repo name', async () => {
        await newRepoPage.clickCreateRepoButton();
        await expect(newRepoPage.repoNameField).toHaveJSProperty('validity.valueMissing', true);
        await expect(newRepoPage.repoNameField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
        await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
    });


    test('Verify correct owner preselected', async () => {
        await newRepoPage.assureCorrectOwnerPreselected(validUser.username);
    });

    test('Verify "Initialize Repository" checkbox is checked when gitignore is selected', async () => {
        await newRepoPage.selectGitignoreTemplates(['VisualStudio']);
        await expect(newRepoPage.initializeWithReadmeCheckbox).toBeChecked();
    });

    test('Verify "Initialize Repository" checkbox is checked when license template is selected', async () => {
        await newRepoPage.selectLicenseTemplate('MIT');
        await expect(newRepoPage.initializeWithReadmeCheckbox).toBeChecked();
    });

    test('Create a repo based on a template', async () => {
        const repoName = faker.lorem.word();
        await newRepoPage.createRepository({
            repoName,
            repoTemplateName: '58',
            templateItems: ['git_content', 'avatar']
        });
        await repoDetailsPage.waitForRepoPage(validUser.username, repoName);
    });

    test('Create a brand new repo', async () => {
        const repoName = faker.lorem.word();
        await newRepoPage.createRepository({
            repoName,
            isPrivate: true,
            description: faker.lorem.sentence(),
            labels: 'Default',
            gitignoresTemplate: ['VisualStudio', 'Packer'],
            licenseTemplate: 'MIT',
            defaultBranchName: faker.lorem.word(),
            isTemplate: true
        });
        await repoDetailsPage.waitForRepoPage(validUser.username, repoName);
    });

}); 
