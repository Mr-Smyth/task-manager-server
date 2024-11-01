const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const {
  validateTask,
  validateUpdateTask,
} = require("../middleware/taskValidators"); 

// Route for creating a task
router.post("/", validateTask, tasksController.createTask);

// Route for getting all tasks
router.get("/", tasksController.getAllTasks);

// Route for updating a task
router.patch("/:id", validateUpdateTask, tasksController.updateTask);

// Route for deleting a task
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
