import { expect, test } from '@playwright/test';

test('example domain loads', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page).toHaveTitle('Example Domain');
  await expect(page.locator('h1')).toHaveText('Example Domain');
});
