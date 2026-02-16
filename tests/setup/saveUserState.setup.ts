import { expect, test } from '../../utils/fixtures/pages';
import { faker } from '@faker-js/faker/locale/en';
import { generateUniqueEmail } from "../../utils/data-generation/emails";
import saveUserData from '../../utils/data-generation/saveUserData';
import saveRepoData from '../../utils/data-generation/saveRepoData';

test('Register testUser1 with a repo template and save storage state', async ({ registerPage, dashboardPage, newRepoPage, repoDetailsPage }) => {
    const testUserName = faker.internet.username();
    const testEmail = generateUniqueEmail();
    const testPassword = faker.internet.password({ length: 10 });
    const templateRepoNameSetup = `AQA-repo-${faker.lorem.word()}`;

    await registerPage.register(testUserName, testEmail, testPassword, testPassword);
    await registerPage.page.waitForURL('/');

    await expect(dashboardPage.navBarUserName).toHaveText(testUserName);
    await registerPage.page.context().storageState({ path: '.states/test-user1-storage-state.json' });
    saveUserData({ testUserName, testEmail, testPassword }, './test-data/users-data/testUser1.json');

    await dashboardPage.clickCreateNewRepoButton();
    await newRepoPage.createRepository({
      repoName: templateRepoNameSetup,
      isTemplate: true
    });
    await repoDetailsPage.waitForRepoPage(testUserName, templateRepoNameSetup);
    saveRepoData({ repoName: templateRepoNameSetup, isTemplate: true }, './test-data/repos-data/testRepoTemplate1.json');
});