import {test, expect, type Page } from '@playwright/test';
import {credentialsFornetlifyInValid,credentialsFornetlifyValid} from '../../Test data/credential_qainterview.netlify'



// Test case - Success login
test('qainterview.netlify.app - Success login', async ({ page }) => {
  // Prevent the site from opening a native browser print dialog.
  await page.addInitScript(() => {
    window.print = () => {};
  });

  await page.goto('https://qainterview.netlify.app/');

  await expect(page).toHaveTitle(/Login/);
  await page.waitForTimeout(3000); // wait 3 seconds

  // click on the sign in link
  
  // key in the username and password from the credentialsForgeek object
  await page.getByPlaceholder("Email Address").fill(credentialsFornetlifyValid.username);
  
  await page.getByPlaceholder('password').fill(credentialsFornetlifyValid.password);

  // click on the sign in button
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForTimeout(3000); // wait 3 seconds
  
  // The print dialog is suppressed by the init script above, so wait for
  // the dashboard instead of trying to click an `OK` element in the DOM.
  await expect(
    page.getByRole('heading', { name: 'Stock Market Dashboard' }),
  ).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: 'Stock Name' }),
  ).toBeVisible();

  await page.waitForTimeout(3000); // wait 3 seconds
  
});