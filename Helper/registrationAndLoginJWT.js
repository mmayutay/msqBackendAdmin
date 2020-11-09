var jwt = require("jsonwebtoken");

module.exports.generateJWT = (data) => {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: data._id,
        email: data.email,
        name: data.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
}