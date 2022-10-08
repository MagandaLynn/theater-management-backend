const Task = require('../models/Task')
const Member = require('../models/Member')
const asyncHandler = require('express-async-handler')

// @desc Get all tasks 
// @route GET /tasks
// @access Private
const getAllTasks = asyncHandler(async (req, res) => {
    // Get all tasks from MongoDB
    const tasks = await Task.find().lean()

    // If no tasks 
    if (!tasks?.length) {
        return res.status(400).json({ message: 'No tasks found' })
    }

    // Add member name to each task before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const tasksWithMember = await Promise.all(tasks.map(async (task) => {
        const member = await Member.findById(task.member).lean().exec()
        return { ...task, name: member.firstName + ' ' + member.lastName}
    }))

    res.json(tasksWithMember)
})

// @desc Create new task
// @route POST /tasks
// @access Private
const createNewTask = asyncHandler(async (req, res) => {
    const { member, title, description } = req.body

    // Confirm data
    if (!member || !title || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Task.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate task title' })
    }

    // Create and store the new member 
    const task = await Task.create({ member, title, description })

    if (task) { // Created 
        return res.status(201).json({ message: 'New task created' })
    } else {
        return res.status(400).json({ message: 'Invalid task data received' })
    }

})

// @desc Update a task
// @route PATCH /tasks
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const { id, member, title, description, completed } = req.body

    // Confirm data
    if (!id || !member || !title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm task exists to update
    const task = await Task.findById(id).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    // Check for duplicate title
    const duplicate = await Task.findOne({ title }).lean().exec()

    // Allow renaming of the original task 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate task title' })
    }

    task.member = member
    task.title = title
    task.description = description
    task.completed = completed

    const updatedTask = await task.save()

    res.json(`'${updatedTask.title}' updated`)
})

// @desc Delete a task
// @route DELETE /tasks
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Task ID required' })
    }

    // Confirm task exists to delete 
    const task = await Task.findById(id).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    const result = await task.deleteOne()

    const reply = `Task '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask
}