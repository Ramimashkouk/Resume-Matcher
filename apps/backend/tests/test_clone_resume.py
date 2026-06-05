import tempfile
import unittest
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

from fastapi import HTTPException

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import Database
from app.routers import resumes as resumes_router


class TestCloneResumeDatabase(unittest.TestCase):
    def test_clone_resume_creates_independent_copy(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            db = Database(db_path=Path(tmpdir) / "db.json")
            source = db.create_resume(
                content="original content",
                content_type="json",
                filename="resume.json",
                processed_data={"summary": "Original"},
                processing_status="ready",
                cover_letter="Cover letter",
                outreach_message="Outreach",
                title="Original Resume",
            )

            cloned = db.clone_resume(source["resume_id"])

            self.assertNotEqual(source["resume_id"], cloned["resume_id"])
            self.assertEqual(cloned["title"], "Copy of Original Resume")
            self.assertFalse(cloned["is_master"])
            self.assertIsNone(cloned["parent_id"])
            self.assertEqual(cloned["content"], source["content"])
            self.assertEqual(cloned["processed_data"], source["processed_data"])
            self.assertIsNot(cloned["processed_data"], source["processed_data"])

            cloned["processed_data"]["summary"] = "Changed"
            self.assertEqual(source["processed_data"]["summary"], "Original")

            db.close()


class TestCloneResumeEndpoint(unittest.IsolatedAsyncioTestCase):
    async def test_clone_resume_rejects_master_resume(self) -> None:
        mock_db = MagicMock()
        mock_db.get_resume.return_value = {
            "resume_id": "master-1",
            "is_master": True,
        }

        with patch.object(resumes_router, "db", mock_db):
            with self.assertRaises(HTTPException) as ctx:
                await resumes_router.clone_resume_endpoint("master-1")

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("master resume", ctx.exception.detail.lower())
