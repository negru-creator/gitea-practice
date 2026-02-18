import test, { expect } from "@playwright/test";
import UserSettingsService from "../../api/services/UserSettingsService";
import testUser1 from '../../test-data/users-data/testUser1.json';
import UserSettingsDTO from "../../api/dto/userSettings.dto";
import { faker } from "@faker-js/faker/locale/en";

test.describe('User Settings API', () => {
    let userSettingsService: UserSettingsService;
    test.beforeEach(async ({ request }) => {
        userSettingsService = new UserSettingsService(request);
    });

    test('Get user settings with valid token', async ({ }) => {
        const response = await userSettingsService.getUserSettings(testUser1.userToken);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        const expectedKeys: (keyof UserSettingsDTO)[] = [
            'full_name',
            'website',
            'description',
            'location',
            'language',
            'theme',
            'diff_view_style',
            'hide_email',
            'hide_activity'
        ];
        expect(Object.keys(responseBody).sort()).toEqual(expectedKeys.sort());
    });

    test('Get user settings with invalid token', async ({ }) => {
        const response = await userSettingsService.getUserSettings('invalid_token');
        expect(response.status()).toBe(401);
        expect((await response.json()).message).toBe('invalid username, password or token');
    });

    test('Update user\'s full name with valid token', async ({ }) => {
        const fullName = faker.person.fullName();
        const newSettings: UserSettingsDTO = {
            full_name: fullName,
        };
        const response = await userSettingsService.updateUserSettings(testUser1.userToken, newSettings);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject({ ...newSettings });
        expect(responseBody).toHaveProperty('full_name', fullName);

    });

    test('Update user\'s website with valid token', async ({ }) => {
        const website = faker.internet.url();
        const newSettings: UserSettingsDTO = {
            website: website,
        };
        const response = await userSettingsService.updateUserSettings(testUser1.userToken, newSettings);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject({ ...newSettings });
        expect(responseBody).toHaveProperty('website', website);
    });

    test('Update user\'s description with valid token', async ({ }) => {
        const description = faker.lorem.sentence();
        const newSettings: UserSettingsDTO = {
            description: description,
        };
        const response = await userSettingsService.updateUserSettings(testUser1.userToken, newSettings);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject({ ...newSettings });
        expect(responseBody).toHaveProperty('description', description);
    });

    test('Update user\'s location with valid token', async ({ }) => {
        const location = faker.location.city();
        const newSettings: UserSettingsDTO = {
            location: location,
        };
        const response = await userSettingsService.updateUserSettings(testUser1.userToken, newSettings);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject({ ...newSettings });
        expect(responseBody).toHaveProperty('location', location);
    });
});