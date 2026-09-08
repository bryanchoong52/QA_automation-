import {test, expect, type Page } from '@playwright/test';
import {credentialsForgeek, credentialsInvalidForgeek} from '../../Test data/credential'
import { LoginPage } from '../../pages/loginPage';



test('geeksforgeeks.org - Success login with Page Object Model', async ({ page }) => {
  // Prevent the site from opening a native browser print dialog.
  const loginPage = new LoginPage(page);

  // Navigate to the login page
  await loginPage.navigateToMainPagegeeks4geeks();
  // Perform login action using the Page Object Model
  await page.getByRole('button', { name: 'Sign In' }).click();

// Fill in the username and password fields using the Page Object Model
  await loginPage.loginPage(credentialsForgeek.username, credentialsForgeek.password);
  
  // Wait for the dashboard page to load and verify its elements using the Page Object Model
  await loginPage.timeoutfor3seconds();

  
});

test('geeksforgeeks.org - Failed login with Page Object Model', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Navigate to the login page
  await loginPage.navigateToMainPagegeeks4geeks();
  // Perform login action using the Page Object Model
  await page.getByRole('button', { name: 'Sign In' }).click();  

  // Fill in the username and password fields using the Page Object Model
  await loginPage.loginPage(credentialsInvalidForgeek.username, credentialsInvalidForgeek.password);
  
  // Wait for the error message to be visible and verify its content using the Page Object Model
  await loginPage.timeoutfor3seconds();
  await expect(page.getByText('Incorrect login credentials i.e userHandle/email or password')).toBeVisible();

  
});

// Test case - open geeksforgeeks website and access the python page and then access the array page
test('open geeksforgeeks website', async ({ page }) => {
  await page.goto('https://www.geeksforgeeks.org/');

  // check the title of the page
  await expect(page).toHaveTitle(/GeeksforGeeks/);
  await page.waitForTimeout(3000); // wait 3 seconds

  // click on the Python link
  //await page.getByRole("link", { name: "Python" }).click();

  await page.locator("a").filter({ hasText: "Python" }).first().click();
  // check the sub title for data structures and algorithm

  await page.waitForTimeout(3000); 
  //Scrolls to the exact bottom of the page
  await page.evaluate(() => window.scrollTo(0, 500));

  await page.locator("span").filter({ hasText: "Data Structures" }).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000); // wait 3 seconds

  // click the link to array page 

  await page.locator("a").filter({ hasText: "Arrays" }).first().click();
  // check the heading for python arrays after clicked from the python page
  await page.getByRole("heading", { name: "Python Arrays" }).isVisible();

  // hold for 3 seconds to see the result
  await page.waitForTimeout(3000); // wait 3 seconds
});



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




