from playwright.sync_api import Page, expect


def test_example_domain_loads(page: Page) -> None:
    page.goto("https://example.com")

    expect(page).to_have_title("Example Domain")
    expect(page.locator("h1")).to_have_text("Example Domain")
