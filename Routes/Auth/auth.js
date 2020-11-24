var express = require("express"),
    router  = express.Router(),
    AWS = require("aws-sdk"),
    uuid = require("uuid");
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt"),
    keys = require("../../config/keys"),
    jwt = require("jsonwebtoken"),
    passport= require("passport"),
    GraphicalCounters = require("../../controller/GraphicalCounters");

//Body Parser -------------------
router.use(bodyParser.urlencoded({extended : false}));
router.use(methodOverride("_method"));
router.use(bodyParser.json()); 


// Load Input Validations
const validateRegisterInput = require('../../Validation/register.js');
const validateLoginInput = require('../../Validation/login.js');
const validateChangePasswordInput = require('../../Validation/password.js');

//----------------------------------------------------------------------------------------------------
// -------------------------------------Aws Configuration------------------------------------------------------------
AWS.config.update({
    region: "ap-south-1",
    accessKeyId : keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
  });
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
//---------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
//Access = Private Route only for admin
//Desc = register User
//Path = POST /auth/register
router.post("/auth/register",passport.authenticate('jwt',{session: false}), (req, res)=>{
if(req.user.isAdmin){
//Do Validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check Validation
if (!isValid) {
  return res.status(400).json(errors);
}

//Get body
const Username = req.body.username;

//Error Object
var error ={};
var success ={}

// Check if Username already exists
var params = 
    { 
    TableName: keys.Table,
    IndexName: 'Username-index',
    KeyConditionExpression: 'Username = :Username',
    ExpressionAttributeValues: { ':Username' : Username} 
    };

docClient.query(params, (err , data)=> {
    if(err){
        error.message ="Error connecting to database"
        res.status(400).json(error)
    }else{
        
        //If User exists then number of item recieved from querry will be more than 0
        if(data.Count > 0){
            error.message="Username already exists";
            res.status(400).json(error);

        } else{
    //Make New User
    const newUser ={
        name: req.body.username,
        email: req.body.email,
        id : uuid.v4(),
        type:"User",
        password: req.body.password,
        isAdmin: false,
        uploads: 0
    }
 

    bcrypt.genSalt(10 , (err , salt) => {
        bcrypt.hash(newUser.password , salt , (err , hash)=> {
            if(err){
                error.bcrypt="Password was not hashed";
                return res.status(400).json()
            } else{
                newUser.password = hash;
                var params = {
                    TableName : keys.Table,
                    Item:{
                        "type": newUser.type,
                        "id": newUser.id,
                        "Username": newUser.name,
                        "email": newUser.email ,
                        "password": newUser.password  ,
                        "isAdmin" : newUser.isAdmin ,
                        "uploads": newUser.uploads               
                        }
                    }
                           //Add newly created user to database
                        docClient.put(params, function(err, data) {
                            if (err) {
                            error.message="User was not registered"
                               res.status(400).json(err)
                            } else {
                                var params = {
                                    TableName: keys.Table,
                                    Key: {
                                        "type" : "Counters",
                                        "id": keys.CounterId
                                  },
                                    UpdateExpression: " ADD #counter :incva",
                                    ExpressionAttributeNames:{
                                        "#counter":"UserCount"
                                    },
                                    ExpressionAttributeValues:{
                                        ":incva":1
                                    },
                                    ReturnValues:"UPDATED_NEW"
                                };
                                docClient.update(params, (err , data) =>{
                                    if(err){
                                        console.log(err);
                                        res.status(400).json({"message": "Error Updating Counter"})
                
                                    }else{
                                        return res.json({
                                            message : "Added User"
                                        })
                                    }
                                })
                            }
                           })
            
                        }//end of else
           
           
        }); //end of Hash fuction
    }) //End of salt
    //Hashing of password takes little time so we set a timeout function to populate password variable
          } //End of else
     }//End of else
  })//End of User Checking
}else{
    res.json({"message": "UnAuthorised Access"})
}
})//End of Route
//--------------------------------------------End of the Route-----------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Access = Public Routes
//Desc = Login User / Returning Jwt Token
//Path = POST /auth/register
router.post("/auth/login"  ,(req , res)=> {

//Do Validations
const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }



  const Username = req.body.username;
  const password = req.body.password;

  var error ={};
  var success ={}



  //Find User by Username.
  var params = 
    { 
    TableName: keys.Table,
    IndexName: 'Username-index',
    KeyConditionExpression: 'Username = :Username',
    ExpressionAttributeValues: { ':Username' : Username},
    
    };

    docClient.query(params, (err , data)=> {
        if(data){

           //Check if Username exists or not
            if(data.Count == 0){
                error.message = "Username does not exists"
                res.status(400).json(error);
            } else {
                console.log(data.Items)
                //Username exists now doing password validation
                bcrypt.compare(password , data.Items[0].password).then(isMatch => {
                    if(isMatch){
                        
                   //User Matched
                   const payload = { id: data.Items[0].id , Username: data.Items[0].Username , email: data.Items[0].email , type: data.Items[0].type , isAdmin: data.Items[0].isAdmin }

                   //Sign Token
                   jwt.sign(payload ,
                     keys.JwtSecret ,
                     {expiresIn: 3600*12*2},

                     (err, token) =>{
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                   })
                        
                     }
                    );

                 } else {
                    error.message="Incorrect Password"
                     return res.status(400).json(error)
                 }
                 })
            }
            
         } else{
            error.message ="Netowrk Issue"
            req.status(400).json(error);  
         }
    })
})

//@Route Get api/users/current
//@desc Return Current user Info
//@access Private
router.get("/api/user/current" ,passport.authenticate('jwt',{session: false}), (req, res) =>{
    res.json({
        id: req.user.id,
        username: req.user.Username,
        email: req.user.email,
        isAdmin: req.user.isAdmin
    });
})




//@Route Put api/users/changePassword
//@desc Update the User Password
//@access Private
router.put("/auth/changePassword" ,passport.authenticate('jwt',{session: false}) , (req, res) => {

    //Do Validation
        const { errors, isValid } = validateChangePasswordInput(req.body);
        // Check Validation
        if (!isValid) {
          return res.status(400).json(errors);
        } 
    var error ={};
    var success={};
    //Match Old Password
    //Get Current User id through Jwt Token
    const Username = req.body.username
    //Get passwords from the body
    var oldPassword = req.body.oldpassword;
    var newPassword = req.body.newpassword;
    //get Current User Password from database
    var params= {
    TableName : keys.Table,
    IndexName: "Username-index",
    KeyConditionExpression: '#user_name = :name',
    ExpressionAttributeNames:{
        "#user_name": "Username",
    },
    ExpressionAttributeValues: { 
       ":name": Username         
  } 
};

docClient.query(params, (err , data)=> {
    if(data){
      //Check if User exists or not
        if(data.Count == 0){
            error.changepassword="User was not found"
            return res.status(400).json(error)
        } else {
             //If we find the user
             //Compare the old password
             bcrypt.compare(oldPassword , data.Items[0].password).then(isMatch => {
                if(isMatch){
                    //Password is matched now update the database with new Password
                    //Hash the new Password
                    bcrypt.genSalt(10 , (err , salt) => {
                        bcrypt.hash(newPassword , salt , (err , hash)=> {
                            if(err) {
                            //If there is problem with the hashing
                             error.changepassword="Password was not hashed"
                             return res.status(400).json(error);
                            } else{
                                newPassword = hash;
                                params = {
                                    TableName : keys.Table,
                                    Key:{
                                        "type": data.Items[0].type,
                                        "id": data.Items[0].id,           
                                        },
                                    UpdateExpression: "set password = :p",
                                    ExpressionAttributeValues:{
                                        ":p" : newPassword
                                    },
                                    ReturnValues:"UPDATED_NEW"
                                    }
                                       //Run Update command 
                                        docClient.update(params, function(err, data) {
                                            if (err) {
                                               error.changepassword="Password was not changed"
                                               return res.status(400).json(error)
                                            } else {
                                                success.message ="Password changed Successfully"
                                                res.json(success);
                                            }
                                           })

                            }
                        }); //End of Hash
                    })//End of Bcrypt salt function
                }else{
                    //Old Password was not matched
                    error.changepassword="Incorrect Old password";
                    res.status(400).json(error)

                }
             })           
        }
    }  else{
        error.changepassword="Failed Connecting to database"
        res.status(400).json(error)
    }
     
    });
})
//------------------------End of the Route--------------------------------------------------------------------------


module.exports = router;