var jwt = require('jsonwebtoken');

const jwtSign =async (payload) => {
	try {
		return jwt.sign({_id:payload._id},"qwertyuioplkjhgfdsazxcvbnmlkjhgfdsa");
	} catch (error) {
		throw error;
	}
};

module.exports = {
    jwtSign:jwtSign
}