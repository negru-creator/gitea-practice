import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '../utils/fixtures/pages';
import testUser1Data from '../test-data/users-data/testUser1.json';

test.describe('Create new repository', () => {
  const testUserName = testUser1Data.testUserName;
  test.use({ storageState: '.states/test-user1-storage-state.json' });
  test.beforeEach(async ({ dashboardPage, newRepoPage }) => {
    await dashboardPage.navigateTo();
    await dashboardPage.clickCreateNewRepoButton();
    await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
    await expect(newRepoPage.newRepoHeader).toBeVisible();
  });

  test('Verify that the description of a new empty repository is displayed correctly', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    const repoDescription = faker.lorem.sentence();

    await newRepoPage.createRepository({ repoName, description: repoDescription });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkDescriptionDisplayedForEmptyRepo(repoDescription);
  });

  test('Verify that the description of a new initialized repository is displayed correctly', async ({ newRepoPage, repoDetailsPage }) => {
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

  test('Verify that the private label is displayed for private repositories', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;

    await newRepoPage.createRepository({ repoName, isPrivate: true });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkPrivateLabelDisplayed();
  });

  test('Verify that the template label is displayed for template repositories', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;

    await newRepoPage.createRepository({ repoName, isTemplate: true });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkTemplateLabelDisplayed();
  });

  test('Verify that correct license template is displayed on repo details page', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    const licenseTemplate = '0BSD';

    await newRepoPage.createRepository({ repoName, licenseTemplate });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkLicenseLinksDisplayed(licenseTemplate);
  });

  test('Verify that gitignore template is displayed on repo details page', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;

    await newRepoPage.createRepository({
      repoName,
      gitignoresTemplate: ['VisualStudio']
    });

    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
    await repoDetailsPage.checkGitignoreLinkDisplayed();
  });
});