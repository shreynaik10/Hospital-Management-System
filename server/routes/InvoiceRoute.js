const express = require("express");
const router = express.Router();

const {
    getInvoice
} = require('../controllers/InvoiceController.js');




router.get('/prescription/invoice/:id', getInvoice);

module.exports = router