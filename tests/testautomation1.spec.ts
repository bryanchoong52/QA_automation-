import { test, expect } from '@playwright/test';

const successloginCases = [
  {
    name: 'valid standard user',
    username: 'standard_user',
    password: 'secret_sauce',
    expected: 'success',
  },
] as const;

const failedLoginCases = [
    ,
  {
    name: 'invalid username and password',
    username: 'tes',
    password: 'tes',
    expected: 'error',
    errorMessage: 'Username and password do not match',
  },
  {
    name: 'empty username and password',
    username: '',
    password: '',
    expected: 'error',
    errorMessage: 'Username is required',
  }
]

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Swag Labs/);
});

//test('test insert account', async ({ page }) => {
  //await page.goto('/');
  // Click the get started link.
  //await page.getByRole('link', { name: 'Get started' }).click();
  // Insert username and password
  //await page.getByPlaceholder('Username').fill('tes');
    //await page.getByPlaceholder('Password').fill('tes');
    //await page.getByRole('button', { name: 'Login' }).click();

// validate the login credential
   // const errorMessage = page.locator('[data-test="error"]');
    //await expect(errorMessage).toBeVisible();
    
  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
//});




for (const loginCase of successloginCases) {
  test(`login validation - ${loginCase.name}`, async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(loginCase.username);
    await page.getByPlaceholder('Password').fill(loginCase.password);
    await page.getByRole('button', { name: 'Login' }).click();

    if (loginCase.expected === 'success') {
      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    } else {
      const errorMessage = page.locator('[data-test="error"]');

      await expect(errorMessage).toBeVisible();
     // await expect(errorMessage).toContainText(loginCase.errorMessage);
      await expect(page).toHaveURL(/.*saucedemo\.com\/?/);
    }
  });
}
