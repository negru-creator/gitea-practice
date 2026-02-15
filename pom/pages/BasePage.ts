import { Page } from "@playwright/test";
import { step } from "../../utils/data-generation/decorators/step";

export default class BasePage {
    page: Page;
    url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = '';
    }

    @step('Navigate to page: {url}')
    async navigateTo() {
        await this.page.goto(this.url);
    }
}