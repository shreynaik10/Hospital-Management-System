const PDFDocument = require('pdfkit');
const fs = require('fs');
const Prescription = require("../models/prescription.js");


const createInvoiceJSON = (prescription) => {
    const invoice = {
        shipping: {
            name: prescription.appointmentId.patientId.userId.firstName + " " + prescription.appointmentId.patientId.userId.lastName,
            address: prescription.appointmentId.patientId.address,
            city: "Cambridge",
            state: "ON",
            country: "CA",
            postal_code: 94111
        },
        items: [
            {
                item: "Visitation",
                dosage: "",
                quantity: 1,
                amount: 200
            }
            // {
            //     item: "Ibuprofen",
            //     dosage: "3 x 7 days",
            //     quantity: 2,
            //     amount: 60
            // },
            // {
            //     item: "Advil",
            //     dosage: "2 x 7 days",
            //     quantity: 1,
            //     amount: 20
            // }
        ],
        subtotal: 820,
        paid: 0,
        invoice_nr: prescription._id
    };


    for (item of prescription.prescribedMed) {
        invoice.items[invoice.items.length] = {
            item: item.medicineId.name,
            dosage: item.dosage,
            quantity: item.qty,
            amount: item.medicineId.price * item.qty
        }
    }

    //calculating subtotal 
    let total = 0;

    invoice.items.forEach((item) => {
        total += item.quantity * item.amount;
    });

    invoice.subtotal = total;
    invoice.paid = total;

    return invoice;
}

async function getInvoice(req, res) {
    const prescriptionId = req.params.id;
    const prescription = await Prescription.findById(prescriptionId)
        .populate({
            path: 'prescribedMed.medicineId',
        }).populate({
            path: 'appointmentId',
            populate: [
                {
                    path: 'patientId',
                    populate: {
                        path: 'userId',
                    }
                },
                {
                    path: 'doctorId',
                    populate: {
                        path: 'userId'
                    }
                }
            ]
        });
    const filePath = `./public/invoice/medical_invoice_${prescriptionId}.pdf`;
    const invoiceJson = createInvoiceJSON(prescription)

    // createInvoice(invoiceJson, filePath, prescriptionId);
    const generatePdfPromise = new Promise((resolve, reject) => {
        createInvoice(invoiceJson, filePath, prescriptionId, () => {
            resolve();
        });
    });
    await generatePdfPromise;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=medical_invoice_${prescriptionId}.pdf`);
    fs.createReadStream(filePath).pipe(res);

}

function createInvoice(invoice, path, prescriptionId, callback) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(path));
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    // doc.pipe(fs.createWriteStream(path)); 
    doc.on('end', () => {
        callback();
    });
}

function generateHeader(doc) {
    doc
        .image("./public/images/logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("GreenHll Hospital", 110, 57)
        .fontSize(10)
        .text("GreenHll Hospital", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("Kitchener, ON, N7T 9U7", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.subtotal - invoice.paid),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(
            invoice.shipping.city +
            ", " +
            invoice.shipping.state +
            ", " +
            invoice.shipping.country,
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Dosage",
        "Unit Cost",
        "Quantity",
        "Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.item,
            item.dosage,
            formatCurrency(item.amount / item.quantity),
            item.quantity,
            formatCurrency(item.amount)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.subtotal)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Paid To Date",
        "",
        formatCurrency(invoice.paid)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(invoice.subtotal - invoice.paid)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    dosage,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(dosage, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "$" + (cents).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}


module.exports = {
    getInvoice
}