import { test, expect } from '@playwright/test';

const validLoginCases = [
  {
    name: 'valid standard user',
    username: 'standard_user',
    password: 'secret_sauce',
  },
] as const;

const invalidLoginCases = [
  {
    name: 'invalid username and password',
    username: 'tes',
    password: 'tes',
    errorMessage: 'Username and password do not match',
  },
  {
    name: 'empty username and password',
    username: '',
    password: '',
    errorMessage: 'Username is required',
  },
] as const;

async function openLoginPage(page) {
  await page.goto('/playwright/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByPlaceholder('Username')).toBeVisible();
}

async function login(page, username: string, password: string) {
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('has title', async ({ page }) => {
  await openLoginPage(page);
  //await expect(page).toHaveTitle(/Swag Labs/);
});

for (const loginCase of validLoginCases) {
  test(`login success - ${loginCase.name}`, async ({ page }) => {
    await openLoginPage(page);
    await login(page, loginCase.username, loginCase.password);
    console.log('login success - ' + loginCase.name);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });
}

for (const loginCase of invalidLoginCases) {
  test(`login error - ${loginCase.name}`, async ({ page }) => {
    await openLoginPage(page);
    await login(page, loginCase.username, loginCase.password);

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(loginCase.errorMessage);
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });
}
