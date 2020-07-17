const { s3 } = require('../src/aws-s3.js');
const fs = require('fs');

/**
     * Uploads a single image to S3 and returns the data
     */

exports.uploadSingleImageToS3 = async (filename, filepath, keyPath) => {
	var keyName = new Date().getTime() + '_' + filename;
	keyName = keyName.replace(/\s/g, '_');
	var params = {
		ACL    : 'public-read',
		Bucket : process.env.AWS_BUCKET_NAME,
		Body   : fs.createReadStream(filepath),
		Key    : `${keyPath}/${keyName}`
	};
	return await s3.upload(params).promise();
};

/**
     * Uploads a single image to S3 and returns the data
     */

/**
     * Delete a single image from S3 using its name and returns success or failure
     */

exports.deleteSingleImageFromS3 = async (keyPath) => {
	const key = keyPath.split('.com/')[1];
	return await s3
		.deleteObject({
			Bucket : process.env.AWS_BUCKET_NAME,
			Key    : key
		})
		.promise();
};

/**
		 * Delete a single image from S3 using its name and returns success or failure
		 */

exports.fileFilterImage = (req, file, callback) => {
	console.log(file.mimetype);
	if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
		req.fileError = 'Only JPEG or PNG files are allowed';
		callback(null, false);
	}
	callback(null, true);
};
