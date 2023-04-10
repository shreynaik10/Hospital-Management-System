const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const Prescription = require("../../models/prescription.js");

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

router.post('/payment', async (req, res) => {
  const { value } = req.body;
  let prescriptions = await Prescription.findById(value).populate({path: 'prescribedMed.medicineId'});
  let prescribedMed = prescriptions.prescribedMed;
  let items_array = [];
  var subtotal = 200;
  var total = 200;
  items_array[0] = {"tax":0,"sku":value,"currency":"CAD","name":"Visitation","description":"Visitation","quantity":1,"price":"200.00"}
  if(prescribedMed){
    prescribedMed.map((pre, index) => (
      total+=(pre.medicineId.price*pre.qty),
      subtotal+=(pre.medicineId.price*pre.qty),
      items_array[index+1] = {"tax":0,"sku":pre.medicineId._id,"currency":"CAD","name":pre.medicineId.name,"description":pre.medicineId.description,"quantity":pre.qty,"price":(pre.medicineId.price).toFixed(2)}
    ));
  }
 
  let create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: process.env.HOST + '/prescriptions/success?prescriptionId='+value,
      cancel_url: process.env.HOST + '/prescriptions/cancel',
    },
    transactions: [
      {
        item_list: {
          items: items_array,
        },
        amount: {
          currency: 'CAD',
          total: total,
          details: {
            shipping: '0', //shipping
            subtotal: subtotal, // subtotal
            shipping_discount: '0.00', //shipping discount
            insurance: '0.00', // insurance
            handling_fee: '0.00', // handling fee
            tax: '0', // tax
          },
        },
        description: 'Prescription for '+value,
        payment_options: {
          allowed_payment_method: 'IMMEDIATE_PAY',
        },
      },
    ],
  };
 
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          // res.redirect(payment.links[i].href);
          res.status(201).json({
            status: 'success',
            link: payment.links[i].href,
          });
        }
      }
    }
  });
});

router.get('/success', (req, res) => {
  console.log(req.query);
  var paymentId = req.query.paymentId;
  var prescriptionId = req.query.prescriptionId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, async function (error, payment) {
    if (error) {
      console.error(JSON.stringify(error));
    } else {
      if (payment.state == 'approved') {
        //console.log(JSON.stringify(payment, null, '\t'));
        console.log('payment completed successfully');
        let paid = await Prescription.findByIdAndUpdate(prescriptionId , { "paid": 1 });

        res.status(201).json({
          status: 'success',
          payment: payment,
        });
        // res.send('Success');
      } else {
        res.status(400).json({
          status: 'payment not successful',
          payment: {},
        });
      }
    }
  });
});

router.get('/cancel', (req, res) =>
  res.status(201).json({
    status: 'fail',
    msg: 'Please try again.',
  })
);

module.exports = router;
