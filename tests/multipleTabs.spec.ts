import test, { expect } from "@playwright/test";

test('multiple tabs test', async ({ page, context }) => {
    const helpPagePromise = context.waitForEvent('page');
    await page.goto('/');
    await page.getByText('Help').click();
    const helpPage = await helpPagePromise;
    await expect(helpPage.locator('h1', { hasText: 'What is Gitea?' })).toBeVisible();
});
