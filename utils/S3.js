const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region : process.env.S3_REGION
});

exports.S3Upload = (filename, filepath) => {
    const uploadParams = {
        Bucket: '',
        Key: '',
        Body: null,
    };
    const params = uploadParams;
    uploadParams.Bucket = process.env.S3_BUCKET_NAME;
    uploadParams.Key = filename;
    uploadParams.Body = filepath;
    return s3Client.upload(params).promise();
};

exports.S3DeleteFile = (filepath) => {
    var deleteParams = {
        Bucket: '',
        Key: ''
    };
    const params = deleteParams;
    deleteParams.Bucket = process.env.S3_BUCKET_NAME;
    deleteParams.Key = filepath;
    return s3Client.deleteObject(params).promise();
}