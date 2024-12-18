const getAuditLogs = require("../db/api/audit/getAuditLogs");

/**
 * Handles fetching of audit logs.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function fetchAuditLogs(req, res) {
  try {
    const { entity, entityId } = req.query; // Optional filters
    const logs = await getAuditLogs(entity, entityId);
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch audit logs" });
  }
}

module.exports = {
    fetchAuditLogs,
  };
