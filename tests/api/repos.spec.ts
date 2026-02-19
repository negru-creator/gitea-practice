import { test, expect } from '@playwright/test';
import testUser1 from '../../test-data/users-data/testUser1.json';
import { faker } from '@faker-js/faker/locale/en';
import RepositoryService from '../../api/services/RepositoryService';
import { RepoFactory } from '../../utils/factories/repo.factory';

test.describe('Repos API tests', () => {
    let repoService: RepositoryService;
    test.beforeEach(async ({ request }) => {
        repoService = new RepositoryService(request);
    });

    test.describe('Create a repo', () => {
        test('Create a repo with just a name', async ({ }) => {
            const APIrepoName = `test-repo-date-${Date.now()}`;
            const createRepoDTO = RepoFactory.create({ name: APIrepoName });
            const response = await repoService.createRepo(testUser1.userToken, createRepoDTO);
            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            expect(responseBody.name).toBe(APIrepoName);
            expect(responseBody.full_name).toBe(`${testUser1.testUserName}/${APIrepoName}`);
        })

        test('Attempt to create a repo without a name', async ({ }) => {
            const createRepoDTO = RepoFactory.create({ name: '' });
            const response = await repoService.createRepo(testUser1.userToken, createRepoDTO);
            expect(response.status()).toBe(422);
            const responseBody = await response.json();
            expect(responseBody.message).toBe('[Name]: Required');
        });

        test('Attempt to create a repo with an existing name', async ({ }) => {
            const name = `conflict-repo-${Date.now()}`;
            await repoService.createRepo(testUser1.userToken, RepoFactory.create({ name }));
            const createRepoDTO = RepoFactory.create({ name });
            const response = await repoService.createRepo(testUser1.userToken, createRepoDTO);

            expect(response.status()).toBe(409);
            const responseBody = await response.json();
            expect(responseBody.message).toBe('The repository with the same name already exists.');
        });

        test('Create a repo with invalid token', async ({ }) => {
            const APIrepoName = `test-repo-invalid-token-${Date.now()}`;
            const createRepoDTO = RepoFactory.create({ name: APIrepoName });
            const response = await repoService.createRepo('invalidtoken123', createRepoDTO);
            expect(response.status()).toBe(401);
            const responseBody = await response.json();
            expect(responseBody.message).toBe('invalid username, password or token');
        });

        test('Create a repo with a description', async ({ }) => {
            const APIrepoName = `test-repo-desc-${Date.now()}`;
            const repoDescription = faker.lorem.sentence();
            const createRepoDTO = RepoFactory.create({ name: APIrepoName, description: repoDescription });
            const response = await repoService.createRepo(testUser1.userToken, createRepoDTO);
            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            expect(responseBody.name).toBe(APIrepoName);
            expect(responseBody.full_name).toBe(`${testUser1.testUserName}/${APIrepoName}`);
            expect(responseBody.description).toBe(repoDescription);
        });

        test('Create a private repo', async ({ }) => {
            const APIrepoName = `test-repo-private-${Date.now()}`;
            const createRepoDTO = RepoFactory.create({ name: APIrepoName, private: true });
            const response = await repoService.createRepo(testUser1.userToken, createRepoDTO);
            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            expect(responseBody.name).toBe(APIrepoName);
            expect(responseBody.full_name).toBe(`${testUser1.testUserName}/${APIrepoName}`);
            expect(responseBody.private).toBe(true);
        });

        test('Create a repo as a template', async ({ }) => {
            const APIrepoName = `test-repo-template-${Date.now()}`;
            const createRepoDTO = RepoFactory.create({ name: APIrepoName, template: true });
            const response = await repoService.createRepo(testUser1.userToken, createRepoDTO);
            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            expect(responseBody.name).toBe(APIrepoName);
            expect(responseBody.full_name).toBe(`${testUser1.testUserName}/${APIrepoName}`);
            expect(responseBody.template).toBe(true);
        });


    });
    test.describe('Delete a repo', () => {
        test('Delete a repo after creating it', async ({ }) => {
            const APIrepoName = `test-repo-delete-${Date.now()}`;
            const createRepoDTO = RepoFactory.create({ name: APIrepoName });
            const createResponse = await repoService.createRepo(testUser1.userToken, createRepoDTO);
            expect(createResponse.status()).toBe(201);
            const deleteResponse = await repoService.deleteRepo(testUser1.userToken, testUser1.testUserName, APIrepoName);
            expect(deleteResponse.status()).toBe(204);
        });
    });
});


test.afterAll(async ({ request }) => {
    const repositoryService = new RepositoryService(request);
    const response = await request.get('api/v1/user/repos', {
        headers: { 'Authorization': `token ${testUser1.userToken}` }
    });
    const reposList = await response.json();
    for (const repo of reposList) {
        if (repo.name.startsWith('test-repo-')) {
            await repositoryService.deleteRepo(testUser1.userToken, repo.owner.login, repo.name);
        }
    }
});