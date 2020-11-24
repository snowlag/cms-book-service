var stream = require('stream');
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');
const AWS = require('aws-sdk');
const sharp = require('sharp');

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

//-------------------------Upload Image through Multer-s3- (not used) ------------------------------------------------------------------------------------
const ImgUpload = multer({
  storage: multerS3({
   s3: s3Client,
   bucket: keys.Bucket,
   acl: 'public-read',
   key: function (req, file, cb) {
    cb(null, "Poster/"+path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
   },
   shouldTransform: function (req, file, cb) {
    cb(null, "Poster/"+path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
  },
  transforms: [{
     transform: function(req, file, cb) {
      //Perform desired transformations
      const extname = path.extname( file.originalname ).toLowerCase();
      cb(
        null,      
        sharp()
          .resize(256, 256)
          .max()
      );
    }
  }]
 }),
  
  limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  //Check Filr Type
  fileFilter: function( req, file, cb ){
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
   if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: Images Only!' );
    }
 }
 }).single('selectedImage');
 module.exports = ImgUpload;
















