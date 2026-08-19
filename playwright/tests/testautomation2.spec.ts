import {test, expect, type Page } from '@playwright/test';
import { credentialsForgeek, credentialsInvalidForgeek} from '../Test data/credential';



// Test case - valid login
test('Login Valid', async ({ page }) => {
    // access the geeksforgeeks website
  await page.goto('https://www.geeksforgeeks.org/');

  await expect(page).toHaveTitle(/GeeksforGeeks/);
  await page.waitForTimeout(3000); // wait 3 seconds

  // click on the sign in link
  await page.getByRole('button', { name: 'Sign In' }).click();

  // key in the username and password from the credentialsForgeek object
  await page.getByPlaceholder("Username or Email").fill(credentialsForgeek.username);
  
  await page.getByPlaceholder('Enter password').fill(credentialsForgeek.password);

  // click on the sign in button
  await page.getByTitle("Sign In").click();


  await page.waitForTimeout(3000); // wait 3 seconds
});

// Test case - invalid login
test('invalid login', async ({ page }) => {

    await page.goto('https://www.geeksforgeeks.org/');

    await expect(page).toHaveTitle(/GeeksforGeeks/);
  await page.waitForTimeout(3000); // wait 3 seconds

    // click on the sign in link
  await page.getByRole('button', { name: 'Sign In' }).click();

  // key in the username and password from the credentialsForgeek object
  await page.getByPlaceholder("Username or Email").fill(credentialsInvalidForgeek.username);
  
  await page.getByPlaceholder('Enter password').fill(credentialsInvalidForgeek.password);

  

   // click on the sign in button. 
  await page.getByTitle("Sign In").click();
// check for the error message
  await expect(page.getByText('Incorrect login credentials i.e userHandle/email or password')).toBeVisible();

  await page.waitForTimeout(3000); // wait 3 seconds

});


