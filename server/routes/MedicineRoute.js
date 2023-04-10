const express = require("express");
const router = express.Router();

const {
    getMedicines,
    getMedicineById,
    saveMedicine,
    updateMedicine,
    deleteMedicine
} = require('../controllers/MedicineController.js')



router.get('/medicines', getMedicines);
router.get('/medicines/:id', getMedicineById);
router.post('/medicines', saveMedicine);
router.patch('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', deleteMedicine);

module.exports = router