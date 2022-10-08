const User = require ('../models/User')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private

const createNewUser = asyncHandler( async (req, res) => {
    const {memberID, username, password} = req.body
    if(!memberID){
        return res.status(400).json({message: 'Member ID required. Please see admin to get your memberID'})
    }
    if(!username || !password ){
        return res.status(400).json({message: 'All fields are required'})
    }

    const duplicate = await User.findOne({username})
    if(duplicate){
        return res.status(409).json({message: 'Duplicate username'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = {username, "password": hashedPwd, memberID}

    const user = await User.create(userObject)
    console.log(user)
    if(user){
        res.status(201).json({message: `New user ${user} created`})
    }
    else{
        res.status(400).json({message: 'invalid user data received'})
    }
})
// @desc Update User
// @route PATCH /users
// @access Private

const updateUser = asyncHandler( async (req, res) => {
    const {id, username, password} = req.body

    if(!id || !username) {
        return res.status(400).json({message: 'all fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'user not found'})
    }

    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'duplicate username'})
    }

    user.username= username
    user.level=level

    if(password){
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})

})

// @desc Delete User
// @route Delete /users
// @access Private

const deleteUser = asyncHandler( async (req, res) => {
    const {id} = req.body

    if(!id){
        return res.status(400).json({message: 'user ID required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'user not found'})
    }

    const result = await user.deleteOne()
    const reply= `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}