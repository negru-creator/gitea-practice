import { test, expect } from '@playwright/test';
import DashboardPage from '../pom/pages/DashboardPage';
import NewRepoPage from '../pom/pages/NewRepoPage';
import SignInPage from '../pom/pages/SignInPage';
import RepoDetailsPage from '../pom/pages/RepoDetailsPage';
import RegisterPage from '../pom/pages/RegisterPage';
import { faker } from '@faker-js/faker/locale/en';
import { generateUniqueEmail } from '../utils/data-generation/emails';

test.describe('Create new repository', () => {
  let dashboardPage: DashboardPage;
  let newRepoPage: NewRepoPage;
  let signInPage: SignInPage;
  let repoDetailsPage: RepoDetailsPage;

  let testUserName: string;
  let testEmail: string;
  let testPassword: string;
  let templateRepoName: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const registerPage = new RegisterPage(page);
    dashboardPage = new DashboardPage(page);
    newRepoPage = new NewRepoPage(page);
    repoDetailsPage = new RepoDetailsPage(page);

    testUserName = faker.internet.username();
    testEmail = generateUniqueEmail();
    testPassword = faker.internet.password({ length: 10 });

    await registerPage.navigateTo();
    await registerPage.register(testUserName, testEmail, testPassword, testPassword);

    await expect(dashboardPage.successRegistrationMessage).toBeVisible();
    await expect(dashboardPage.navBarUserName).toHaveText(testUserName);

    templateRepoName = faker.lorem.word();

    await dashboardPage.clickCreateNewRepoButton();
    await newRepoPage.createRepository({
      repoName: templateRepoName,
      isTemplate: true
    });

    await repoDetailsPage.waitForRepoPage(testUserName, templateRepoName);

    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    newRepoPage = new NewRepoPage(page);
    signInPage = new SignInPage(page);
    repoDetailsPage = new RepoDetailsPage(page);

    await signInPage.navigateTo();
    await signInPage.signIn(testUserName, testPassword);

    await dashboardPage.clickCreateNewRepoButton();

    await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
    await expect(newRepoPage.newRepoHeader).toBeVisible();
  });

  test('Verify that the description of a new empty repository is displayed correctly', async () => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    const repoDescription = faker.lorem.sentence();

    await newRepoPage.createRepository({ repoName, description: repoDescription });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkDescriptionDisplayedForEmptyRepo(repoDescription);
  });

  test('Verify that the description of a new initialized repository is displayed correctly', async () => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    const repoDescription = faker.lorem.sentence();

    await newRepoPage.createRepository({ 
      repoName, 
      description: repoDescription, 
      isInitialized: true 
    });

    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkDescriptionDisplayedForInitializedRepo(repoDescription);
  });

  test('Verify that the private label is displayed for private repositories', async () => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;

    await newRepoPage.createRepository({ repoName, isPrivate: true });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkPrivateLabelDisplayed();
  });

  test('Verify that the template label is displayed for template repositories', async () => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;

    await newRepoPage.createRepository({ repoName, isTemplate: true });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkTemplateLabelDisplayed();
  });

  test('Verify that correct license template is displayed on repo details page', async () => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    const licenseTemplate = '0BSD';

    await newRepoPage.createRepository({ repoName, licenseTemplate });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkLicenseLinksDisplayed(licenseTemplate);
  });

  test('Verify that gitignore template is displayed on repo details page', async () => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;

    await newRepoPage.createRepository({ 
      repoName, 
      gitignoresTemplate: ['VisualStudio'] 
    });

    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkGitignoreLinkDisplayed();
  });
});

