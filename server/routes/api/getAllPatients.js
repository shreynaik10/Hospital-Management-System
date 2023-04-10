
module.exports = (req, res) => {

    res.json({
        message: 'Patients fetched successfully',
        nurses: {
            "test": "test"
        }
    })
}