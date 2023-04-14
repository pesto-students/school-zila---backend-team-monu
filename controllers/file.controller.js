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
        Key: 'courses/abc.png' || `courses/${Math.floor(Math.random()*999999+1)}_${imageName|| 'abc'}`,
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

  const fileDownload = async (req,res) => {
	try
	{
		//  // download the file via aws s3 here
		 var fileKey = "courses/abc.png";
 
		//  console.log('Trying to download file', fileKey);
		//  var options = {
		// 	 Bucket    : BUCKET_NAME,
		// 	 Key    : fileKey,
		//  };
	  
		//  res.attachment(fileKey);
		//  var fileStream = s3.getObject(options).createReadStream();
		//  fileStream.pipe(res);

		const params = {
				 Bucket    : BUCKET_NAME,
				 Key    : fileKey,
			 };
		  s3.getObject(params, (err, data) => {
			if (err) console.error(err);
			fs.writeFileSync(fileKey, data.Body.toString());
			console.log(`${fileKey} has been created!`);
			res.download(fileKey);
		  });	
			// var file = fs.readFile(fileKey, 'binary');
			// res.setHeader('Content-Length', stat.size);
			// res.setHeader('Content-Type', 'image/png');
			// res.setHeader('Content-Disposition', 'attachment; filename=your_file_name');
			// res.write(file, 'binary');
			// res.end();
			
			
}
catch(err)
{
	console.error(err)
    return res.status(400).send({
		error:err
	});
}
  };

  module.exports = {fileUpload, fileDownload};