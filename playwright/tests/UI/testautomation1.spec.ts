import { test, expect, type Page } from '@playwright/test';


// test data for login scenarios
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


// function to open login page
async function openLoginPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByPlaceholder('Username')).toBeVisible();
}
// login function
async function login(page: Page, username: string, password: string) {
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// test case - valid login 
for (const loginCase of validLoginCases) {
  test(`login success - ${loginCase.name}`, async ({ page }) => {
    await openLoginPage(page);
    await login(page, loginCase.username, loginCase.password);
    console.log('login success - ' + loginCase.name);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });
}

// test case - invalid login
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
