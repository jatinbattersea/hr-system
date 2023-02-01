const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    const verifyUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({"tokens._id": verifyUser.id});

    if (user == null) {
       res.clearCookie("_goJwt");
       return  res.sendStatus(401);
    }
    next();
}

module.exports = verifyToken;