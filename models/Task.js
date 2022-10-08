const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const taskSchema = new Schema({
    member: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

taskSchema.plugin(AutoIncrement,{
    inc_field: 'task',
    id: 'taskNums',
    start_seq: 500
})

module.exports = mongoose.model('Task', taskSchema)