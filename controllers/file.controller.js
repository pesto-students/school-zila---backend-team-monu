const AWS = require('aws-sdk')
const async = require('async')
require("dotenv").config();
const path = require('path')
const fs = require('fs')
const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;
let pathParams, image, imageName;
/** After config file load, create object for s3*/
const s3 = new AWS.S3(
    {
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET,
        region: 'ap-south-1',
    }
)
const createMainBucket = (callback) => {
	// Create the parameters for calling createBucket
	const bucketParams = {
	   Bucket : BUCKET_NAME
	};                    
	s3.headBucket(bucketParams, function(err, data) {
	   if (err) {
	   	console.log("ErrorHeadBucket", err)
	      	s3.createBucket(bucketParams, function(err, data) {
			   if (err) {
			   	console.log("Error", err)
			      callback(err, null)
			   } else {
			      callback(null, data)
			   }
			});
	   } else {
	      callback(null, data)
	   }
	})                             
}
const createItemObject = (callback) => {
  const params = { 
        Bucket: BUCKET_NAME, 
        Key: `courses/${Math.floor(Math.random()*999999+1)}_${imageName|| 'abc'}`,
        ACL: 'public-read',
        Body:image
    };
	s3.putObject(params, function (err, data) {
		if (err) {
	    	console.log("Error uploading image: ", err);
	    	callback(err, null)
	    } else {
	    	console.log("Successfully uploaded image on S3", data);
	    	callback(null, data)
	    }
	})  
}

const fileUpload = async(req, res, next) => {
    var tmp_path = req.files.file.path;
	var tmp_path = req.files.file.path;
	image = fs.createReadStream(tmp_path);
    imageName = req.files.file.name;
    async.series([
        createMainBucket,
        createItemObject
        ], (err, result) => {
        if(err) return res.send(err)
        else return res.json({message: "Successfully uploaded"}) 
    })
  };
  module.exports = {fileUpload};