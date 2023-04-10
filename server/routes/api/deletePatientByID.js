

module.exports = (req, res) => {
    patientID = req.params.id
    res.json({
        message: 'Patient deleted successfully'
    });

}