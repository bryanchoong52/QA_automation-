from __future__ import annotations

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class LoginPage:
    """Page object for the QA Interview login page and dashboard transition."""

    LOGIN_ERROR_MESSAGE = "Invalid username or password"

    def __init__(self, driver: WebDriver, timeout: int = 10) -> None:
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout)

    def open(self, url: str) -> "LoginPage":
        """Open the supplied login page URL."""
        self.driver.get(url)
        return self

    def wait_until_loaded(self, expected_title: str = "Login Page") -> "LoginPage":
        """Wait until the login page title is visible."""
        return self.wait_until_title(expected_title)

    def wait_until_dashboard_loaded(
        self, expected_title: str = "Stock Market Dashboard"
    ) -> "LoginPage":
        """Wait until a successful login has opened the dashboard."""
        return self.wait_until_title(expected_title)

    def wait_until_title(self, expected_title: str) -> "LoginPage":
        """Wait for an exact browser title and return this page object."""
        self.wait.until(EC.title_is(expected_title))
        return self

    def login(self, username: str, password: str) -> "LoginPage":
        """Fill in the login form and submit it."""
        username_field = self.wait.until(
            EC.visibility_of_element_located((By.ID, "username"))
        )
        password_field = self.wait.until(
            EC.visibility_of_element_located((By.ID, "password"))
        )

        username_field.clear()
        username_field.send_keys(username)
        password_field.clear()
        password_field.send_keys(password)

        submit_button = self.wait.until(
            EC.element_to_be_clickable((By.ID, "loginBtn"))
        )
        submit_button.click()
        return self

    def wait_for_login_error(
        self, expected_message: str = LOGIN_ERROR_MESSAGE
    ) -> str:
        """Wait for and return the visible invalid-login message."""
        error_locator = (By.ID, "errorMsg")
        self.wait.until(EC.visibility_of_element_located(error_locator))
        self.wait.until(EC.text_to_be_present_in_element(error_locator, expected_message))
        return self.driver.find_element(*error_locator).text.strip()

    @property
    def title(self) -> str:
        return self.driver.title

    @property
    def current_url(self) -> str:
        return self.driver.current_url
