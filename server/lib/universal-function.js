var jwt = require('jsonwebtoken');

const jwtSign =async (payload) => {
	try {
		console.log(payload._id);
		return jwt.sign({_id:payload._id},"qwertyuioplkjhgfdsazxcvbnmlkjhgfdsa");
	} catch (error) {
		throw error;
	}
};

const jwtVerify = async(token) => {
	try {
		return jwt.verify(token, "qwertyuioplkjhgfdsazxcvbnmlkjhgfdsa");
	} catch (error) {
		throw error;
	}
};
module.exports = {
    jwtSign:jwtSign,
	jwtVerify:jwtVerify
}