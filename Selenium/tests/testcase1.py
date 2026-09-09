from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator

import pytest
from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver

from Selenium.page.LoginPage import LoginPage
from Selenium.utils.SetupChrome import setup_chrome


PROJECT_ROOT = Path(__file__).resolve().parents[2]
PAGE_URL_FILE = PROJECT_ROOT / "Selenium" / "data" / "test_data" / "page_url" / "page_url.json"
USER_DATA_FILE = PROJECT_ROOT / "Selenium" / "data" / "test_data" / "user_data" / "user_data.json"
REPORT_DIR = PROJECT_ROOT / "Selenium" / "report"
RUN_TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%S.%fZ")
RUN_REPORT_DIR = REPORT_DIR / RUN_TIMESTAMP
VALID_LOGIN_SCENARIO = "valid_login"
INVALID_PASSWORD_SCENARIO = "invalid_password"
INVALID_USERNAME_SCENARIO = "invalid_username"


@dataclass(frozen=True)
class UserAccount:
    scenario: str
    username: str
    password: str
    status: str


def load_target_url() -> str:
    """Read the configured page URL, with a BASE_URL override for CI."""
    configured_url = os.getenv("BASE_URL", "").strip()
    if configured_url:
        return configured_url

    with PAGE_URL_FILE.open(encoding="utf-8") as page_file:
        page_urls = json.load(page_file)

    if not isinstance(page_urls, list) or not page_urls:
        raise ValueError(f"No page URLs configured in {PAGE_URL_FILE}")

    target_url = page_urls[0].get("url")
    if not isinstance(target_url, str) or not target_url.strip():
        raise ValueError(f"The first page URL is missing a valid 'url': {PAGE_URL_FILE}")

    return target_url.strip()


def load_user_accounts() -> list[UserAccount]:
    """Load and validate all credential scenarios from the JSON test data file."""
    with USER_DATA_FILE.open(encoding="utf-8") as user_file:
        user_data = json.load(user_file)

    if not isinstance(user_data, list) or not user_data:
        raise ValueError(f"No user accounts configured in {USER_DATA_FILE}")

    accounts: list[UserAccount] = []
    for index, record in enumerate(user_data):
        if not isinstance(record, dict):
            raise ValueError(f"User record {index} must be a JSON object")

        scenario = record.get("scenario")
        username = record.get("username")
        password = record.get("password")
        status = record.get("status")
        values = (scenario, username, password, status)
        if not all(isinstance(value, str) and value.strip() for value in values):
            raise ValueError(
                "User record "
                f"{index} must contain non-empty scenario, username, password, and status values"
            )

        accounts.append(
            UserAccount(
                scenario=scenario.strip(),
                username=username.strip(),
                password=password,
                status=status.strip(),
            )
        )

    return accounts


def is_active_account(account: UserAccount) -> bool:
    """Return whether a test account is marked active in the JSON data."""
    return account.status.casefold() == "active"


def load_scenario(scenario: str) -> UserAccount:
    """Load exactly one credential record for a named JSON scenario."""
    matches = [account for account in load_user_accounts() if account.scenario == scenario]
    if len(matches) != 1:
        raise ValueError(
            f"Expected exactly one '{scenario}' scenario in {USER_DATA_FILE}, found {len(matches)}"
        )
    return matches[0]


def load_active_account() -> UserAccount:
    """Load the active valid-login account with optional CI credential overrides."""
    active_account = load_scenario(VALID_LOGIN_SCENARIO)
    if not is_active_account(active_account):
        raise ValueError(f"The '{VALID_LOGIN_SCENARIO}' account must have status 'active'")

    return UserAccount(
        scenario=active_account.scenario,
        username=os.getenv("TEST_USERNAME", active_account.username),
        password=os.getenv("TEST_PASSWORD", active_account.password),
        status=active_account.status,
    )


def capture_screenshot(driver: WebDriver, scenario: str) -> Path:
    """Save a scenario screenshot under a unique UTC timestamped run directory."""
    RUN_REPORT_DIR.mkdir(parents=True, exist_ok=True)
    screenshot_path = RUN_REPORT_DIR / f"{scenario}.png"
    if not driver.save_screenshot(str(screenshot_path)):
        raise AssertionError(f"Could not save Selenium screenshot: {screenshot_path}")
    return screenshot_path


@pytest.fixture()
def driver() -> Iterator[WebDriver]:
    """Create one browser per test and always close it afterward."""
    service, chrome_options = setup_chrome()
    browser = webdriver.Chrome(service=service, options=chrome_options)
    browser.set_page_load_timeout(20)

    try:
        yield browser
    finally:
        browser.quit()


def open_login_page(driver: WebDriver) -> LoginPage:
    """Open and wait for a fresh login page for each test."""
    return LoginPage(driver).open(load_target_url()).wait_until_loaded()


def test_login_with_active_account(driver: WebDriver) -> None:
    """Verify that the active JSON account can log in to the dashboard."""
    active_account = load_active_account()

    login_page = open_login_page(driver)
    assert login_page.title == "Login Page"

    login_page.login(active_account.username, active_account.password).wait_until_dashboard_loaded()
    assert login_page.title == "Stock Market Dashboard"

    capture_screenshot(driver, "valid-login-dashboard")


def test_login_with_active_account_incorrect_password(driver: WebDriver) -> None:
    """Verify that the JSON invalid-password scenario is rejected."""
    invalid_password_case = load_scenario(INVALID_PASSWORD_SCENARIO)
    assert is_active_account(invalid_password_case), "The invalid-password account must be active"

    login_page = open_login_page(driver)
    login_page.login(invalid_password_case.username, invalid_password_case.password)

    assert login_page.wait_for_login_error() == LoginPage.LOGIN_ERROR_MESSAGE
    assert login_page.title == "Login Page"
    capture_screenshot(driver, "invalid-password")


def test_login_with_incorrect_username(driver: WebDriver) -> None:
    """Verify that the JSON invalid-username scenario is rejected."""
    invalid_username_case = load_scenario(INVALID_USERNAME_SCENARIO)

    login_page = open_login_page(driver)
    login_page.login(invalid_username_case.username, invalid_username_case.password)

    assert login_page.wait_for_login_error() == LoginPage.LOGIN_ERROR_MESSAGE
    assert login_page.title == "Login Page"
    capture_screenshot(driver, "invalid-username")
