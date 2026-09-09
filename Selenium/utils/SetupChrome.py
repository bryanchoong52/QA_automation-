from __future__ import annotations

import os

from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service


def setup_chrome() -> tuple[Service, Options]:
    """Build Chrome options for local and CI test execution.

    Selenium Manager resolves ChromeDriver automatically when
    ``CHROMEDRIVER_PATH`` is not provided.
    """
    chrome_options = Options()
    headless = os.getenv("CI", "").lower() in {"1", "true", "yes"}
    headless = headless or os.getenv("HEADLESS", "").lower() in {"1", "true", "yes"}

    if headless:
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1280,900")

    chromedriver_path = os.getenv("CHROMEDRIVER_PATH")
    service = Service(chromedriver_path) if chromedriver_path else Service()
    return service, chrome_options
