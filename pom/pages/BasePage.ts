import { Page } from "@playwright/test";

export default class BasePage {
    page: Page;
    url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = '';
    }

    async navigateTo() {
        await this.page.goto(this.url);
    }
}