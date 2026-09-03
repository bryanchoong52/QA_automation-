from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import os
import time


def test_instagram_create_account_page():
    chrome_options = Options()

    if os.getenv("CI"):
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

    chromedriver_path = os.getenv("CHROMEDRIVER_PATH")
    service = Service(chromedriver_path) if chromedriver_path else Service()

    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 20)

    try:
        driver.set_page_load_timeout(20)
        driver.get(os.getenv("BASE_URL", "https://www.instagram.com/"))

        assert "Instagram" in driver.title

        create_account = wait.until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    "//*[self::a or self::button or @role='button']"
                    "[contains(normalize-space(.), 'Create new account')]",
                )
            )
        )
        create_account.click()

        driver.save_screenshot("QAtest1.png")
        time.sleep(2)

    finally:
        driver.quit()
