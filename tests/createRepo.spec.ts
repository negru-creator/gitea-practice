import { faker } from '@faker-js/faker/locale/en';
import { ErrorMessages } from '../test-data/messages/error-messages';
import { expect, test } from '../utils/fixtures/pages';
import testUser1Data from '../test-data/users-data/testUser1.json';
import RepositoryService from '../api/services/RepositoryService';
import { RepoFactory } from '../utils/factories/repo.factory';
import saveRepoData from '../utils/data-generation/saveRepoData';

test.describe('Create new repository', () => {
  const testUserName = testUser1Data.testUserName;
  let templateRepoName: string;
  let repoService: RepositoryService;

  test.use({ storageState: '.states/test-user1-storage-state.json' });

  test.beforeAll(async ({ request }) => {
    repoService = new RepositoryService(request);
    templateRepoName = `AQA-repo-${faker.lorem.word()}`;
    const createRepoDTO = RepoFactory.create({ name: templateRepoName, template: true });
    const response = await repoService.createRepo(testUser1Data.userToken, createRepoDTO);
    if (response.status() !== 201) throw new Error('Failed to create template repo');
    saveRepoData({ repoName: templateRepoName, isTemplate: true }, './test-data/repos-data/testRepoTemplate1.json');
  });


  test.beforeEach(async ({ dashboardPage, newRepoPage }) => {
    await dashboardPage.navigateTo();
    await dashboardPage.clickCreateNewRepoButton();
    await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
    await expect(newRepoPage.newRepoHeader).toBeVisible();

  });

  test('Create repo with only repo name', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    await newRepoPage.createRepository({ repoName });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
  });

  test('Create repo fails without repo name', async ({ newRepoPage }) => {
    await newRepoPage.clickCreateRepoButton();
    await expect(newRepoPage.repoNameField).toHaveJSProperty('validity.valueMissing', true);
    await expect(newRepoPage.repoNameField).toHaveJSProperty('validationMessage', ErrorMessages.FIELD_EMPTY_MESSAGE);
    await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
  });

  test('Verify correct owner preselected', async ({ newRepoPage }) => {
    await newRepoPage.assureCorrectOwnerPreselected(testUserName);
  });

  test('Verify "Initialize Repository" checkbox is checked when gitignore is selected', async ({ newRepoPage }) => {
    await newRepoPage.selectGitignoreTemplates(['VisualStudio']);
    await expect(newRepoPage.initializeWithReadmeCheckbox).toBeChecked();
  });

  test('Verify "Initialize Repository" checkbox is checked when license template is selected', async ({ newRepoPage }) => {
    await newRepoPage.selectLicenseTemplate('MIT');
    await expect(newRepoPage.initializeWithReadmeCheckbox).toBeChecked();
  });

  test('Create a brand new repo', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
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
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
  });

  test('Create a repo based on a template', async ({ newRepoPage, repoDetailsPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    await newRepoPage.createRepository({
      repoName,
      repoTemplateName: templateRepoName,
      templateItems: ['git_content', 'avatar'],
    });
    await repoDetailsPage.waitForRepoPage(testUserName, repoName);
  });

  test('Create a repo based on a template fails without selecting template items', async ({ newRepoPage }) => {
    const repoName = `AQA-repo-${faker.lorem.word()}`;
    await newRepoPage.createRepository({
      repoName,
      repoTemplateName: templateRepoName,
    })
    await expect(newRepoPage.missingTemplateItem).toBeVisible();
    await expect(newRepoPage.page).toHaveURL(newRepoPage.url);
  })

  test.afterAll(async ({ request }) => {
    const repositoryService = new RepositoryService(request);
    const response = await request.get('api/v1/user/repos', {
      headers: {
        'Authorization': `token ${testUser1Data.userToken}`
      }
    });
    const reposList = await response.json();
    for (const repo of reposList) {
      if (repo.name.startsWith('AQA-repo-')) {
        await repositoryService.deleteRepo(testUser1Data.userToken, repo.owner.login, repo.name);
      }
    }
  });
})