import { APIRequestContext } from "@playwright/test";
import UserSettingsDTO from "../dto/userSettings.dto";

export default class UserSettingsService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getUserSettings(token: string) {
        return await this.request.get('/api/v1/user/settings', {
            headers: {
                'Authorization': `token ${token}`
            }
        });
    }

    async updateUserSettings(token: string, userSettings: UserSettingsDTO) {
        return await this.request.patch('/api/v1/user/settings', {
            headers: {
                'Authorization': `token ${token}`
            },
            data: userSettings
        });
    }
}