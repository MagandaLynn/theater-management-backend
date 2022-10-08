const express = require('express')
const router = express.Router()
const schedulesController= require('../controllers/schedulesController')

router.route('/')
.get(schedulesController.getSchedules)
.post(schedulesController.createNewSchedule)
.patch(schedulesController.updateSchedule)
.delete(schedulesController.deleteSchedule)


module.exports = router