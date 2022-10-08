const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,   
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    notes: {
        type: Array,   //viewable by authorized people only
        required: false
    },
    requiredMembers: {
        type: Array,   // role or memberId
        required: true
    }
},
{
    timestamps: true
}
)


module.exports = mongoose.model('Schedule', scheduleSchema)