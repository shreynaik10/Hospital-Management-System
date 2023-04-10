const jwt = require("jsonwebtoken");


function adminAuth(req, res, next) {
    // console.log("adminAuth hit",);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // console.log("adminAuth ",payload);
        if (payload.userType == "Admin") {
            next();
        }
        else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });

}

module.exports = adminAuth;
