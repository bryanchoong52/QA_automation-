import {test, expect, type Page , Locator } from '@playwright/test';

export class LoginPage {

  readonly page: Page; // Reference to the Playwright Page object
  readonly usernameInput: Locator; // Locator for the username input field
  readonly userNameGeeks4geeksInput: Locator; // Locator for the username input field for Geeks4Geeks
  readonly passwordInput: Locator; // Locator for the password input field
  readonly loginButton: Locator; // Locator for the login button
  readonly signInButton: Locator; // Locator for the sign in button

  // Constructor to initialize the page and locators
    constructor(page: Page) {

        this.page = page;
        this.usernameInput = page.getByPlaceholder("Email Address");
        this.userNameGeeks4geeksInput = page.getByPlaceholder("Username or Email");
        this.passwordInput = page.getByPlaceholder('password');
        this.loginButton = page.getByRole('button', { name: 'Login' }); 
        this.signInButton = page.getByTitle("Sign In");

    }
    // Method to perform login action for QA Interview page
    async loginPage(username: string, password: string) {

        // Check if the username and password input fields are visible
        if (await this.usernameInput.isVisible() && await this.passwordInput.isVisible()) {
            console.log('Username and Password input fields are visible. it is QA Interview page.');
            // Proceed with login for QA Interview page
            console.log('It is QA Interview page. Proceeding with login...');
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);

        if (await this.loginButton.isEnabled()) {
            await this.loginButton.click();
        } else {
            expect(this.loginButton).toBeDisabled();
            console.log('Login button is disabled. Cannot proceed with login.');
        }
        } else {
            // Proceed with login for Geeks4Geeks page
            console.log('Username and Password input fields are not visible. It is Geeks4Geeks page.');
            console.log('Geeks4Geeks login page detected. Proceeding with login...');
            await this.userNameGeeks4geeksInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        
        }
        

    }     

    async loginGeeks4geeksPage(username: string, password: string) {
        await this.userNameGeeks4geeksInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async navigateToLoginPageQAInterview() {
        await this.page.goto('https://qainterview.netlify.app/');
        await expect(this.page).toHaveTitle(/Login/);
    }

    async navigateToMainPagegeeks4geeks(){

        await this.page.goto('https://www.geeksforgeeks.org/');
        await expect(this.page).toHaveTitle(/GeeksforGeeks/);
        
    }

     async timeoutfor3seconds() {
        await this.page.waitForTimeout(3000); // wait 3 seconds
    }

    async waitForDashboardPageForQAInterview() {
        await this.timeoutfor3seconds() // wait 3 seconds
        await expect(
            this.page.getByRole('heading', { name: 'Stock Market Dashboard' }),
          ).toBeVisible();
          await expect(
            this.page.getByRole('columnheader', { name: 'Stock Name' }),
          ).toBeVisible();
      
         
    }


   



    
}