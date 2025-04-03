const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
  signatureVersion: 'v4',
});

const bucket = `the${process.env.MODE}-store`;

module.exports.s3 = s3;

// ✅ S3 파일 삭제 함수 추가
module.exports.deleteS3Object = (key) => {
  return s3.deleteObject({ Bucket: bucket, Key: key }).promise();
};

module.exports.cloudfrontParam = (CallerReference, Path) => {
  const param = {
    DistributionId: process.env.storageDistributionId,
    InvalidationBatch: {
      CallerReference: CallerReference,
      Paths: {
        Quantity: 1,
        Items: [Path],
      },
    },
  };
  return param;
};

module.exports.deleteObject = (param, callback) => {
  s3.deleteObject(param, (err, data) => {
    callback(err);
  });
};

module.exports.getObject = (param, filename) => {
  let file = fs.createWriteStream(filename);
  return s3.getObject(param).createReadStream().pipe(file);
};

module.exports.getTempS3Url = (fileKey) => {
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: fileKey,
    Expires: 100,
  });
};
