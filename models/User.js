const mongoose = require('mongoose')
const Schema = mongoose.Schema

//user can create an account using the Member ID number they are given (sent via email)

const userSchema = new Schema({
    memberID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)

