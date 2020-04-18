const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region : process.env.S3_REGION
});

const uploadParams = {
    Bucket: '',
    Key: '',
    Body: null,
};

const S3Upload = (filename, filepath) => {
    const params = uploadParams;
    uploadParams.Bucket = process.env.S3_BUCKET_NAME;
    uploadParams.Key = filename;
    uploadParams.Body = filepath;
    return s3Client.upload(params).promise();
};

module.exports = S3Upload;