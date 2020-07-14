exports.sendErrorMessage = (err) => {
	return {
		error : {
			message : err
		}
	};
};
