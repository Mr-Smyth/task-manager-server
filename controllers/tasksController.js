// controllers/tasksController.js

// This file contains the controller functions that handle the HTTP requests for tasks

// call the users db functions to handle the data actions
const db = require("../db/api/tasks");

// Handle creating a task
async function createTask(req, res) {
  try {
    const taskData = req.body;
    const newTask = await db.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
}

// Handle Getting all tasks
async function getAllTasks(req, res) {
  try {
    const tasks = await db.getAllTasks();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
}

// Handle updating a task
async function updateTask(req, res) {
  try {
    const taskData = req.body;
    const updatedTask = await db.updateTask(req.params.id, taskData);
    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
}

// Handle deleting a task
async function deleteTask(req, res) {
  try {
    const deleted = await db.deleteTask(req.params.id);
    if (deleted) {
      // No content to send back
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};