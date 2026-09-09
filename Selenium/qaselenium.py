"""Backward-compatible entry point for the Selenium smoke test.

The maintained test lives in ``Selenium/tests/testcase1.py``. Run it with:

    python -m pytest Selenium/tests/testcase1.py -v
"""

from Selenium.tests.testcase1 import driver, test_login_with_active_account

__all__ = ["driver", "test_login_with_active_account"]
