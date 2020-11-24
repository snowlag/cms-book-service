let express = require('express');
let router = express.Router();
var AWS = require("aws-sdk");
const ImgUpload = require('../../controller/ImageUploader.js');
const FileUpload = require("../../controller/FileUploader.js")
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
const keys = require('../../config/keys.js');
const multer = require('multer');
var Jimp = require('jimp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require( 'path' );
const passport= require("passport");
const pngToJpeg = require('png-to-jpeg');
const GraphicalCounters = require("../../controller/GraphicalCounters");

// Aws Configuration------------------------------------------------------------
AWS.config.update({
    region: "ap-south-1",
    accessKeyId : keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
  });
 
const S3 = new AWS.S3();
var docClient = new AWS.DynamoDB.DocumentClient();
 
//Body Parser -------------------
router.use(bodyParser.urlencoded({extended : true}));
router.use(methodOverride("_method"));





 router.post('/api/uploadImage',passport.authenticate('jwt',{session: false}), upload.single("selectedImage"), (req, res) => {
  const image = req.file;
  console.log(path.extname(image.originalname ).toLowerCase());

  //Check file extension
  if(path.extname(image.originalname ).toLowerCase() === ".png"){

  const buffer = Buffer.from(image.buffer, 'base64');
  console.log(buffer);
  let BufferOutput;
  try{
  //Convert the png file to jpg
  pngToJpeg({quality: 100})(buffer)
    .then(output =>{
      Jimp.read(Buffer.from(output, 'base64'), function(err,img){
        if (err) throw err;
        img
            .resize(275, 440)
            .quality(80) // set JPEG quality
    
       img.getBuffer(Jimp.AUTO , (err , data) => {
        if(err){
            console.log(err)
        }else{
        var params = {
                 Bucket: keys.Bucket,    
                  Key: "Poster/"+path.basename( image.originalname, path.extname( image.originalname ) ) + '-' + Date.now() + path.extname(image.originalname ),
                  ACL: 'public-read',
                  Body: data,
             }
             console.log(params);
             S3.upload(params, function(err, data) {
                 if (err) {
                    console.log(err);
                 }else{
                GraphicalCounters.updateTotalFileUploads(req , res , 1);
                 res.json({
                   location: data.Location
                 })
                 }
             });
         }
    })
    }); 
      
    })
    .catch(err => res.status(400).json({"message": "Failed to convert image fro png to jpeg try changing extension of image from png to jpeg"}));
  }
  catch(err){
    res.status(400).json({"message": "Corrupted png file , try changing extension of image from png to jpeg"})
  }


  }else if(path.extname(image.originalname ).toLowerCase() === ".jpeg" ||path.extname(image.originalname ).toLowerCase() === ".jpg" ){

   Jimp.read(Buffer.from(Buffer.from(image.buffer, 'base64'), 'base64'), function(err,img){
     if (err) throw err;
       img
        .resize(275, 440)
        .quality(60) // set JPEG quality

   img.getBuffer(Jimp.AUTO , (err , data) => {
    if(err){
        console.log(err)
    }else{
    var params = {
             Bucket: keys.Bucket,
 
              Key: "Poster/"+path.basename( image.originalname, path.extname( image.originalname ) ) + '-' + Date.now() + path.extname(image.originalname ),
              ACL: 'public-read',
              Body: data,
         }
         console.log(params);
         S3.upload(params, function(err, data) {
             if (err) {
                console.log(err);
             }else{
            GraphicalCounters.updateTotalFileUploads(req , res , 1);
             res.json({
               location: data.Location
             })
             }
         });
     }
})
}); 
   }else{
    res.status(400).json({"message": "Invalid file"})
  }
});




//Code to upload without any compression

// router.post('/api/uploadImage', ( req, res ) => {
// //-----------------------Uploading the Image on Aws s3-------------------------------------------------
//   var errors={}
//     ImgUpload( req, res, ( error ) => {
//       // console.log( 'requestOkokok', req.file );
//       // console.log( 'error', error );
//       if( error ){
//        errors.message="Image was not uploaded";
//        res.status(400).json(errors);
//       } else {
//        // If File not found
//        if( req.file === undefined ){
//         console.log( 'Error: No File Selected!' );
//         errors.messsage="No File Selected"
//         res.status(400).json(errors);
//        } else {
//         // If Success store the image url in dynamo database
//         const imageName = req.file.key;
//         const imageLocation = req.file.location;
//         console.log(imageLocation);
//      res.json( {
//          location: imageLocation
//         } );
//        }
//       }
//      });




//     });
 
//------------------------Uploading Files Route-------------------------------------------------------------------------------------------------
router.post('/api/uploadFiles/:file', passport.authenticate('jwt',{session: false}) ,  ( req, res ) => {
    FileUpload( req, res, ( error ) => {
          console.log( 'files', req.files );
          if( error ){
           console.log( 'errors', error );
           res.json( { error: error } );
          } else {
           // If File not found
           if( req.files === undefined ){
            console.log( 'Error: No File Selected!' );
            res.json( 'Error: No File Selected' );
           } else {
            // If Success
            let fileArray = req.files,
             fileLocation;
        const fileLocationarray = [];
            for ( let i = 0; i < fileArray.length; i++ ) {
             fileLocation = fileArray[ i ].location;
             console.log( 'filenm', fileLocation );
             fileLocationarray.push( fileLocation )
            }
            GraphicalCounters.updateTotalFileUploads(req , res , 1);
            // Save the file name into database
        res.json( {
             locationArray: fileLocationarray
            } );
           }
          }
         });
        });





module.exports = router;