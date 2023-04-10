
module.exports = (req, res) => {
    const { firstName, lastName } = req.body;

    res.json({
        message: 'Patient updated successfully'
    });

}