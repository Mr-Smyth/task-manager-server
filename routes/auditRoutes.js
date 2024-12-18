const express = require("express");
const router = express.Router();
const { fetchAuditLogs } = require("../controllers/auditController");

// Route to fetch audit logs
router.get("/", fetchAuditLogs);

module.exports = router;
