const Schedule = require('../models/Schedule')
const Member = require('../models/Member')
const asyncHandler = require('express-async-handler')

//need to update

// @desc Get all schedules 
// @route GET /schedules
// @access Private
const getSchedules = asyncHandler(async (req, res) => {
    // Get all schedules from MongoDB
    const schedules = await Schedule.find().lean()

    // If no schedules 
    if (!schedules?.length) {
        return res.status(400).json({ message: 'No schedules found' })
    }

    // Add member name to each schedule before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const schedulesWithMember = await Promise.all(schedules.map(async (schedule) => {
        const member = await Member.findById(schedule.member).lean().exec()
        return { ...schedule, name: member.firstName + ' ' + member.lastName}
    }))

    res.json(schedulesWithMember)
})

// @desc Create new schedule
// @route POST /schedules
// @access Private
const createNewSchedule = asyncHandler(async (req, res) => {
    const { member, description, location, notes, requiredMembers } = req.body

    // Confirm data
    if (!member || !location || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store the new member 
    const schedule = await Schedule.create({ member, description })

    if (schedule) { // Created 
        return res.status(201).json({ message: 'New schedule created' })
    } else {
        return res.status(400).json({ message: 'Invalid schedule data received' })
    }

})

// @desc Update a schedule
// @route PATCH /schedules
// @access Private
const updateSchedule = asyncHandler(async (req, res) => {
    const { id, member, title, description, completed } = req.body

    // Confirm data
    if (!id || !member || !title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm schedule exists to update
    const schedule = await Schedule.findById(id).exec()

    if (!schedule) {
        return res.status(400).json({ message: 'Schedule not found' })
    }

    // Check for duplicate title
    const duplicate = await Schedule.findOne({ title }).lean().exec()

    // Allow renaming of the original schedule 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate schedule title' })
    }

    schedule.member = member
    schedule.title = title
    schedule.description = description
    schedule.completed = completed

    const updatedSchedule = await schedule.save()

    res.json(`'${updatedSchedule.title}' updated`)
})

// @desc Delete a schedule
// @route DELETE /schedules
// @access Private
const deleteSchedule = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Schedule ID required' })
    }

    // Confirm schedule exists to delete 
    const schedule = await Schedule.findById(id).exec()

    if (!schedule) {
        return res.status(400).json({ message: 'Schedule not found' })
    }

    const result = await schedule.deleteOne()

    const reply = `Schedule '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getSchedules,
    createNewSchedule,
    updateSchedule,
    deleteSchedule
}