const queryRunner = require("../utils/queryRunner");

/**
 * Retrieves audit logs from the database.
 * Optionally filters logs by entity type or entity ID.
 *
 * @param {string|null} entity - The entity type to filter logs (e.g., 'tasks'), or null to fetch all.
 * @param {number|null} entityId - The entity ID to filter logs, or null to fetch all logs.
 * @returns {Promise<Array>} - The list of audit logs.
 */
async function getAuditLogs(entity = null, entityId = null) {
  let query = `SELECT * FROM audit`;
  const params = [];

  if (entity) {
    query += ` WHERE entity = ?`;
    params.push(entity);

    if (entityId) {
      query += ` AND entity_id = ?`;
      params.push(entityId);
    }
  }

  try {
    return await queryRunner(query, params);
  } catch (error) {
    console.error("Error fetching audit logs:", error.message);
    throw new Error("Failed to retrieve audit logs");
  }
}

module.exports = getAuditLogs;
