const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt')

var uniqueValidator = require('mongoose-unique-validator')

const AppointmentSchema = new Schema({

  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  isTimeSlotAvailable: {
    type: Boolean,
    default: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  completed: {
    type: Boolean,
    default: 0
  }
},
  {
    timestamps: true
  });


const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;