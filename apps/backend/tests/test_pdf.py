import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

from playwright.async_api import Error as PlaywrightError

from app.pdf import PDFRenderError, _find_chromium_executable, _launch_browser


def test_find_chromium_executable_skips_snap_only_installations() -> None:
    existing_paths = {
        "/snap/bin/chromium",
        "/snap/chromium/current/usr/lib/chromium-browser/chrome",
    }

    with (
        patch("app.pdf.sys.platform", "linux"),
        patch.dict("app.pdf.os.environ", {}, clear=True),
        patch("app.pdf.Path.exists", new=lambda path: str(path) in existing_paths),
    ):
        assert _find_chromium_executable() is None


def test_launch_browser_reports_snap_chromium_as_unsupported_fallback() -> None:
    playwright = MagicMock()
    playwright.chromium.launch = AsyncMock(
        side_effect=PlaywrightError("Executable doesn't exist")
    )

    with (
        patch("app.pdf._find_chromium_executable", return_value=None),
        patch("app.pdf._find_snap_chromium_executable", return_value="/snap/bin/chromium"),
    ):
        try:
            asyncio.run(_launch_browser(playwright))
        except PDFRenderError as exc:
            message = str(exc)
        else:
            raise AssertionError("Expected PDFRenderError to be raised")

    assert "Snap Chromium was detected" in message
    assert "playwright install chromium" in message