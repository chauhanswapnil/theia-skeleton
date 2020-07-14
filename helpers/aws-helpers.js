const { s3 } = require('../src/aws-s3.js');
const fs = require('fs');

/**
     * Uploads a single image to S3 and returns the data
     */

exports.uploadSingleImageToS3 = async (filename, filepath, keyPath) => {
	var keyName = new Date().getTime() + '_' + filename;
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
