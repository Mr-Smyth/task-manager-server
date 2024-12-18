const db = require("../../sqlite");
const queryRunner = require("./queryRunner");

// utils/logEvent.js
async function logEvent(eventType, entity, entityId, description, userId) {
  const timestamp = new Date().toISOString();
  
  const query = `INSERT INTO audit (event_type, entity, entity_id, description, user_id, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [eventType, entity, entityId, description, userId, timestamp];
  
  try {
    await queryRunner(query, params);
  } catch (error) {
    console.error("Error logging event:", error.message);
  }
}

module.exports = logEvent;
