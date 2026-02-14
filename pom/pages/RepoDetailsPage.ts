import { expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class RepoDetailsPage extends BasePage {


    async waitForRepoPage(username: string, repoName: string) {
        await expect(this.page).toHaveURL(
            new RegExp(`/${username}/${repoName}$`)
        );
    }

}