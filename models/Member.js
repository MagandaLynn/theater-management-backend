const mongoose = require('mongoose')
const Schema = mongoose.Schema

//admin creates new member info
//create a random ID to allower user to signup

const memberSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    permissions: {      //member, admin, stage management, backstage... customizable to add more (props, set, etc)
        type: Array,
        required: true
    },
    roles: {
        type: Array,   // roles in the play
        required: true
    },
    conflicts: {
        type: Array,  //user can add conflicts
        default: []
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    signedIn: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Member', memberSchema)

