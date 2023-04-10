const Medicine = require("../models/medicine.js");

const getMedicines = async (req, res) => {

    try {

        var name = req.query.name;

        let medicines = [];
        if (!name) {
            medicines = await Medicine.find({});
        } else {

            medicines = await Medicine.find({ "name": name });
        }

        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        res.json(medicine);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const isMedicineValid = (newmedicine) => {
    let errorList = [];
    if (!newmedicine.company) {
        errorList[errorList.length] = "Please enter company name";
    }
    if (!newmedicine.name) {
        errorList[errorList.length] = "Please enter medicine name";
    }
    if (!newmedicine.description) {
        errorList[errorList.length] = "Please enter medicine description";
    }
    if (!newmedicine.price) {
        errorList[errorList.length] = "Please enter medicine cost";
    }

    if (errorList.length > 0) {
        result = {
            status: false,
            errors: errorList
        }
        return result;
    }
    else {
        return { status: true };
    }

}

const saveMedicine = async (req, res) => {
    let newmedicine = req.body;
    let medicineValidStatus = isMedicineValid(newmedicine);
    if (!medicineValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: medicineValidStatus.errors
        });
    }
    else {
        const medicine = new Medicine(req.body);
        try {
            const savedMedicine = await medicine.save();
            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }

    }
}

const updateMedicine = async (req, res) => {
    let newmedicine = req.body;
    let medicineValidStatus = isMedicineValid(newmedicine);
    if (!medicineValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: medicineValidStatus.errors
        });
    }
    else {
        try {
            const updatedmedicine = await Medicine.updateOne({ _id: req.params.id }, { $set: req.body });
            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }
    }
}

const deleteMedicine = async (req, res) => {
    try {
        const deletedmedicine = await Medicine.deleteOne({ _id: req.params.id });
        res.status(200).json(deletedmedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getMedicines,
    getMedicineById,
    saveMedicine,
    updateMedicine,
    deleteMedicine
}
