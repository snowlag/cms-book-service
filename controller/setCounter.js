//Run these file only initially 
//Do no run these file again , you will loose counter

const keys = require('../config/keys.js');
const AWS = require('aws-sdk');
const uuid = require("uuid");

AWS.config.update({
    region: "ap-south-1",
    accessKeyId : keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
  });
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var id = uuid.v4();
var params ={
 
    TableName : keys.Table,
    Item:{
        "type": "Counters",
        "id": id,
        "UserCount": 10,
        "BookCount": 18,
        "CategoryCount": 5,
        "DownloadCount": 0,
        "filesCount": 0
        }
    
}

docClient.put(params, function(err, data) {
    if(err){
        console.log(err)
    }else{
        console.log(data)
    }
})
