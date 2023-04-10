const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt')

var uniqueValidator = require('mongoose-unique-validator')

const PrescriptionSchema = new Schema({
	appointmentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Appointment"
	},
	prescribedMed: [{
		medicineId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Medicine"
		},
		dosage: {
			type: String
		},
		qty: {
			type: Number
		}
	}],
	remarks: {
		type: String
	},
	paid: {
		type: Boolean,
		default: 0
	}
},
{
	timestamps: true
}
);

const Precription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = Precription;