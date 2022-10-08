const Member = require ('../models/Member')
const Task= require('../models/Task')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all members
// @route GET /members
// @access Private
const getAllMembers = asyncHandler(async (req, res) => {
    // Get all members from MongoDB
    const members = await Member.find().lean()

    // If no members 
    if (!members?.length) {
        return res.status(400).json({ message: 'No members found' })
    }

    res.json(members)
})

// @desc Create new member
// @route POST /members
// @access Private

const createNewMember = asyncHandler( async (req, res) => {
    const {firstName, lastName, permissions, roles, phone, email} = req.body
    if(!firstName || !lastName || !permissions || !roles || !phone || !email){
        return res.status(400).json({message: 'All fields are required'})
    }

    const memberObject = {firstName, lastName, permissions, roles, phone, email}

    const member = await Member.create(memberObject)
    console.log(member)
    if(member){
        res.status(201).json({message: `New member ${member} created`})
    }
    else{
        res.status(400).json({message: 'invalid member data received'})
    }
})
// @desc Update Member
// @route PATCH /members
// @access Private

const updateMember = asyncHandler( async (req, res) => {
    const {id, firstName, lastName, permissions, roles, conflicts, phone, email} = req.body
   
    const member = await Member.findById(id).exec()

    if(!member){
        return res.status(400).json({message: 'member not found'})
    }

    if(firstName){
        member.firstName= firstName
    }
    if(lastName){
        member.lastName=lastName
    }
    
    if(phone){
        member.phone=phone
    }
    if(email){
        member.email=email
    }
    //the following needs to be updated to be able to be changed by admin only
    if(permissions){
        member.permissions=permissions
    }
    if(roles){
        member.roles=roles
    }
    if(conflicts){
        member.conflicts=conflicts
    }

    //end admin only section (still needs updated)
    const updatedMember = await member.save()

    res.json({message: `${updatedMember.firstName}'s information updated`})

})

// @desc Delete Member
// @route Delete /members
// @access Private

const deleteMember = asyncHandler( async (req, res) => {
    const {id} = req.body

    const member = await Member.findById(id).exec()
    if(!member){
        return res.status(400).json({message: 'member not found'})
    }

    const task= await Task.findOne({member: id}).lean().exec()
    if(task){
        return res.status(400).json({message: 'member has tasks. Please re-assign or remove tasks before deleting member'})
    }
    const result = await member.deleteOne()
    const reply= ` ${result.firstName} ${result.lastName} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports={
    getAllMembers,
    createNewMember,
    updateMember,
    deleteMember
}