import { expect, test } from '../../utils/fixtures/pages';
import { faker } from '@faker-js/faker/locale/en';
import { generateUniqueEmail } from "../../utils/data-generation/emails";
import saveUserData from '../../utils/data-generation/saveUserData';

test('Register testUser1 with a repo template and save storage state', async ({ registerPage, dashboardPage, newRepoPage, repoDetailsPage, userSettingsPage }) => {
  const testUserName = faker.internet.username();
  const testEmail = generateUniqueEmail();
  const testPassword = faker.internet.password({ length: 10 });


  await registerPage.register(testUserName, testEmail, testPassword, testPassword);
  await registerPage.page.waitForURL('/');

  await expect(dashboardPage.navBarUserName).toHaveText(testUserName);


  await dashboardPage.openUserSettings();
  await userSettingsPage.navigateToApplicationsTab();
  const generatedToken = await userSettingsPage.generateNewToken(`TestTokenName-${faker.lorem.word()}`);

  await registerPage.page.context().storageState({ path: '.states/test-user1-storage-state.json' });
  saveUserData({ testUserName, testEmail, testPassword, userToken: generatedToken }, './test-data/users-data/testUser1.json');

});