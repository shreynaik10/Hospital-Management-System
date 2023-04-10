
module.exports = (req, res) => {
    patientID = req.params.id
    res.json({
        message: 'Patient fetched successfully',
        nurse: {
            "test": "test"
        }
    });
}