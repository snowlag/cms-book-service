var stream = require('stream');
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');
const AWS = require('aws-sdk');

const keys = require('../config/Keys.js');
AWS.config.update({
  region: "ap-south-1",
  accessKeyId : keys.AWS_ACCESS_KEY,
  secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
});


const s3Client = new AWS.S3({
    endpoint: "https://s3.amazonaws.com",
    apiVersion: '2006-03-01',
    accessKeyId: keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
    Bucket: keys.Bucket,
    region: "ap-south-1"
    
});

//-------------------------Upload Pdf through Multer-s3-------------------------------------------------------------------------------------
const FileUpload = multer({
  storage: multerS3({
   s3: s3Client,
   bucket: keys.Bucket,
   acl: 'public-read',
   key: function (req, file, cb) {
    cb(null, req.params.file+"/"+path.basename(file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
   }
  }),
  limits:{ fileSize: 5000000 * 20 }, // In bytes: 5000000 bytes = 5 MB *20 = 100mb
  //Check Filr Type
  fileFilter: function( req, file, cb ){
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
   if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: Only Pdf files!' );
    }
 }
 }).array('files', 4 )
 module.exports = FileUpload;
















