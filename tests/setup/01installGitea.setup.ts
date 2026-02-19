import test, { expect } from "playwright/test";

test('Install Gitea', async ({ page }) => {
    if (process.env.CI === 'true') {
        await page.goto('/');
        await expect(page.locator('h3.top.attached')).toHaveText('Initial Configuration');
        await page.getByText('Install Gitea').click();
        await expect(page.getByText('Installing now, please wait…')).not.toBeVisible({ timeout: 60000 });
    }
});