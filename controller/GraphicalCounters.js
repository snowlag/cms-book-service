const AWS = require('aws-sdk');
const uuid = require("uuid");
const keys = require('../config/Keys.js');
const timestamp = require('./getTime.js');



AWS.config.update({
  region: "ap-south-1",
  accessKeyId : keys.AWS_ACCESS_KEY,
  secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var GraphicalCounters  = {};


GraphicalCounters.UpdateMonthlyBookCounter = (req , res , value , NewType) => {
   //check month and year 
   var time  = new Date().getTime();
   var month = new Date().getMonth()+ 1;
   var year = new Date().getFullYear()
   //Check if counter is present or not
   var id = `M_B_C_${month}_${year}`;


   var monthName = new Date().toLocaleString('default', { month: 'short' })
   var type = "Monthly_Book_Counter"
   var params = {
       TableName: keys.Table,
       Key: {
           "type": type,
           "id": id
       },
       UpdateExpression: " SET #counter = #counter + :incva",
       ExpressionAttributeNames:{
           "#counter":"count"
       },
       ExpressionAttributeValues:{
           ":incva": value
       },
       ReturnValues:"UPDATED_NEW"
   };
    docClient.update(params, (err , data) =>{
        if(err){
            if(err.code === "ValidationException"){
                var params = {
                   TableName: keys.Table,
                   Item: {
                       type: type,
                       id: id,
                       count:  value,
                       xpoint: `${monthName}_${year}`,
                       timestamp: time,
                   }
                  }
                   docClient.put(params, function(err, data) {
                    if(err){
                     console.log(err)
                     return res.status(400).json({
                         message: "Error initializing counter"
                     })
                     }else{
                        console.log("Initializied Monthly counter")                          
                        //Update weekly Counter
                        GraphicalCounters.UpdateweeklyBookCounter(req, res , value , NewType);
                      }
                   })
            }else{
                    res.status(400).json({
                        message: "Error updating the weekly counter"
                    })
                 }
        }else{
             //Update weekly Counter
             GraphicalCounters.UpdateweeklyBookCounter(req, res , value , NewType);
        }
    })
  }


GraphicalCounters.UpdateweeklyBookCounter = (req , res , value , NewType) => {
     //check month and year 
   var time  = new Date().getTime();
   var month = new Date().getMonth()+ 1;
   var monthName = new Date().toLocaleString('default', { month: 'long' })
   var d = new Date();
   var week = GraphicalCounters.getWeekOfMonth(d);
   var year = new Date().getFullYear();
   //Check if counter is present or not
   var id = `W_B_C_${week}_${month}_${year}`;
   var type = `${monthName}_${year}_Weekly_Counter`
   console.log(type);

   var params = {
    TableName: keys.Table,
    Key: {
        "type": type,
        "id": id
    },
    UpdateExpression: " SET #counter = #counter + :incva",
    ExpressionAttributeNames:{
        "#counter":"count"
    },
    ExpressionAttributeValues:{
        ":incva": value
    },
    ReturnValues:"UPDATED_NEW"
};
docClient.update(params, (err , data) =>{
    if(err){
        if(err.code === "ValidationException"){
            //Make new Counter
            var params = {
               TableName: keys.Table,
               Item: {
                   type: type,
                   id: id,
                   count:  value,
                   xpoint: `Week ${week}`,
                   timestamp: time,
               }
              }
               docClient.put(params, function(err, data) {
                   if(err){
                       res.status(400).json({
                           message: "Error initializing the counter"
                       })
                   }else{
                       console.log("New Weekly counter initialized");
                       return res.json({
                        message: "Action completed",
                        type: NewType
                    })
                      
                   }
               })

        }
    }else{
        console.log(data)
        console.log("Updated weekly Counter")
        //Update weekely Counter.
       return res.json({
        message: "Action completed",
        type: NewType
    })
    }
})

}


GraphicalCounters.updateUserUploads = async (req ,res , value , item) => {
    var id = req.user.id;
    var username = req.user.Username
    var type = "User"
    //update the user uploads
    var params = {
    
        TableName : keys.Table,
        Key:{
            "type": type,
            "id": id,           
            },
        UpdateExpression: "set #uploads = #uploads + :value",
        ExpressionAttributeNames:{
            "#uploads" : "uploads"
        },
        ExpressionAttributeValues:{
            ":value": value
        },
        ReturnValues:"UPDATED_NEW"
  }
  docClient.update(params , async (err ,data) => {
      if(err){
          console.log("Error Updating User uploads of id : "+id)
      }else{
          console.log("Updated User uploads "+ id)
          var flag1 = await GraphicalCounters.updateUserMonthlyBooks(value , id , username);
          var flag2 = await GraphicalCounters.updateUserWeeklyBooks(value , id , username);
          if(flag1 && flag2){
            return  res.json(item)
          }else{
            return res.status(400).json({
                message : "Error updating counters"
            })
          }
          
      }
  })
}


GraphicalCounters.updateFileCounters = (req , res , value) => {
var  type  = "Monthly_File_Counter"
var time  = new Date().getTime();
var month = new Date().getMonth()+ 1;
var monthName = new Date().toLocaleString('default', { month: 'short' })
var year = new Date().getFullYear();
var id = `M_F_C_${month}_${year}`;
var params = {
    TableName: keys.Table,
    Key: {
        "type": type,
        "id": id
    },
    UpdateExpression: " SET #counter = #counter + :incva",
    ExpressionAttributeNames:{
        "#counter":"count"
    },
    ExpressionAttributeValues:{
        ":incva": value
    },
    ReturnValues:"UPDATED_NEW"
};
 docClient.update(params, (err , data) =>{
     if(err){
         if(err.code === "ValidationException"){
             var params = {
                TableName: keys.Table,
                Item: {
                    type: type,
                    id: id,
                    count:  value,
                    xpoint: `${monthName}_${year}`,
                    timestamp: time,
                }
               }
                docClient.put(params, function(err, data) {
                 if(err){
                  console.log(err)
                  req.status(400).json({
                      messgae: "Error initializing the  file Counter"
                  })

                  }else{
                     console.log("Initializied Monthly file counter")  
                     GraphicalCounters.updateWeeklyFileCounters(req , res , 1)                        
                   }
                })
         }else{
            req.status(400).json({
                messgae: "Error updating the file Counter"
            })
                console.log(err)
              }
     }else{
          //Update weekly Counter
          GraphicalCounters.updateWeeklyFileCounters(req , res , 1)
     }
 })
}


GraphicalCounters.updateWeeklyFileCounters = (req , res , value) => {
    return new Promise((resolve , reject) => {
        var time  = new Date().getTime();
        var month = new Date().getMonth()+ 1;
        var monthName = new Date().toLocaleString('default', { month: 'long' })
        var week = GraphicalCounters.getWeekOfMonth(new Date());
        var year = new Date().getFullYear();
        //Check if counter is present or not
        var id = `W_F_C_${week}_${month}_${year}`;
     
        var type = `${monthName}_${year}_File_Weekly_Counter`
         var params = {
             TableName: keys.Table,
             Key: {
                 "type": type,
                 "id": id
             },
             UpdateExpression: " SET #counter = #counter + :incva",
             ExpressionAttributeNames:{
                 "#counter":"count"
             },
             ExpressionAttributeValues:{
                 ":incva": value
             },
             ReturnValues:"UPDATED_NEW"
         };
          docClient.update(params, async (err , data) =>{
              if(err){
                  if(err.code === "ValidationException"){
                      var params = {
                         TableName: keys.Table,
                         Item: {
                             type: type,
                             id: id,
                             count:  value,
                             xpoint: `Week ${week}`,
                             timestamp: time,
                         }
                        }
                        docClient.put(params, async (err, data) => {
                          if(err){
                           console.log(err)
                           req.status(400).json({
                            messgae: "Error updating the file Counter"
                        })
         
                           }else{
                            console.log("Initialized new weekly file counter")
                                               
                            }
                         })
                  }else{
                         console.log(err)
                         req.status(400).json({
                            messgae: "Error updating the file Counter"
                        })

                       }
              }else{
                   //Update weekly Counter
                   console.log("Updated weekly counter")                 
              }
          })
    })
    }

GraphicalCounters.updateTotalFileUploads = (req ,res , value) => {
    var params = {
        TableName: keys.Table,
        Key: {
            "type": "Counters",
            "id": keys.CounterId
        },
        UpdateExpression: "ADD #counter :incva",
        ExpressionAttributeNames:{
            "#counter":"filesCount"
        },
        
        ExpressionAttributeValues:{
            ":incva":value
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, async (err , data) =>{
        if(err){
            if(err.code === "ValidationException"){
                //Make new Counter.
                console.log("Added new Counter");
                var params = {
                    TableName: keys.Table,
                    Key: {
                        "type": "Counters",
                        "id": keys.CounterId
                    },
                    UpdateExpression: "SET #counter  = :incva",
                    ExpressionAttributeNames:{
                        "#counter":"filesCount"
                    },
                    
                    ExpressionAttributeValues:{
                        ":incva":value
                    },
                    ReturnValues:"UPDATED_NEW"
                };
                 docClient.update(params, async function(err, data) {
                     if(err){
                        return  res.status(400).json({
                             message : "Failed to initialize total files count counter"
                         })
     
                     }else{
                        var flag1 = await GraphicalCounters.updateUserMonthlyFiles(req.user.id , value , req.user.Username);
                         var flag2 = await GraphicalCounters.updateUserWeeklyFiles(req.user.id , value , req.user.Username);
                         if(flag1 && flag2){
                          GraphicalCounters.updateFileCounters(req ,res , value);
                          console.log("Initialized total file count")
                         }else{
                             res.status(400).json({
                                 message : "error updating counter"
                             })
                         }
                        
                     }
                 })
     
            }else{
                return res.status(400).message({
                    message : err.code
                })
            }
        }else{
           var flag1 = await GraphicalCounters.updateUserMonthlyFiles(req.user.id , value , req.user.Username );
           var flag2 = await GraphicalCounters.updateUserWeeklyFiles(req.user.id , value , req.user.Username);
           if(flag1 && flag2){
            GraphicalCounters.updateFileCounters(req ,res , value)
           }else{
               res.status(400).json({
                   message : "error updating counter"
               })
           }
          
           
        }

    })
}

GraphicalCounters.getWeekOfMonth = (date) =>  {
    const startWeekDayIndex = 1; // 1 MonthDay 0 Sundays
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDay = firstDate.getDay();
  
    let weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
    if (startWeekDayIndex === 1) {
      if (date.getDay() === 0 && date.getDate() > 1) {
        weekNumber -= 1;
      }
  
      if (firstDate.getDate() === 1 && firstDay === 0 && date.getDate() > 1) {
        weekNumber += 1;
      }
    }
    return weekNumber;
  }


GraphicalCounters.updateUserMonthlyBooks = async (count , uid , name) => {
    return new Promise((resolve , reject) => {
    var timestamp = new Date().getTime();
    var month = new Date(timestamp).getMonth()+ 1;
    var monthName = new Date(timestamp).toLocaleString('default', { month: 'short' });

    var year = new Date(timestamp).getFullYear();
    var type = `Monthly_Book_${month}_${year}`;
    var xpoint = name

    var params = {
        TableName: keys.Table,
        Key: {
            "type": type,
            "id": uid
        },
        UpdateExpression: " SET #counter = #counter + :incva",
        ExpressionAttributeNames:{
            "#counter": "count"
        },
        ExpressionAttributeValues:{
            ":incva": count
        },
        ReturnValues:"UPDATED_NEW"
    };
     docClient.update(params, async (err , data) =>{
         if(err){
             if(err.code === "ValidationException"){
                var params = {
                    TableName: keys.Table,
                    Item: {
                        type: type,
                        id: uid,
                        count:  count,
                        username: xpoint,
                    }
                   }
                   docClient.put(params, async (err, data) => {
                     if(err){
                      console.log(err)
    
                      }else{
                       console.log("Initialized new Monthly File counter")
                        resolve(true)                         
                       }
                    })
             }else{
                    console.log(err)
                  }
         }else{
              //Update weekly Counter
              console.log("Updated Monthly User counter")
              resolve(true)
         }
     })

    })
}

GraphicalCounters.updateUserWeeklyBooks = async (count , uid , name) => {
    
    return new Promise((resolve , reject) => {
        var timestamp = new Date().getTime();
        var month = new Date(timestamp).getMonth()+ 1;
        var monthName = new Date(timestamp).toLocaleString('default', { month: 'short' })
        var year = new Date(timestamp).getFullYear();

        var week = GraphicalCounters.getWeekOfMonth(new Date(timestamp));
        var type = `Weekly_Book_${week}_${month}_${year}`;
        var xpoint = name;

        var params = {
            TableName: keys.Table,
            Key: {
                "type": type,
                "id": uid
            },
            UpdateExpression: " SET #counter = #counter + :incva",
            ExpressionAttributeNames:{
                "#counter": "count"
            },
            ExpressionAttributeValues:{
                ":incva": count
            },
            ReturnValues:"UPDATED_NEW"
        };
         docClient.update(params, async (err , data) =>{
             if(err){
                 if(err.code === "ValidationException"){
                    var params = {
                        TableName: keys.Table,
                        Item: {
                            type: type,
                            id: uid,
                            count:  count,
                            username: xpoint,
                        }
                       }
                       docClient.put(params, async (err, data) => {
                         if(err){
                          console.log(err)
        
                          }else{
                           console.log("Initialized new Monthly File counter")
                            resolve(true)                         
                           }
                        })
                 }else{
                        console.log(err)
                      }
             }else{
                  //Update weekly Counter
                  console.log("Updated Monthly User counter")
                  resolve(true)
             }
         })

    })
}

GraphicalCounters.updateUserMonthlyFiles = async (uid , count , name) => {
return new Promise((resolve , reject) => {
    var timestamp = new Date().getTime();
    var month = new Date(timestamp).getMonth()+ 1;
    var monthName = new Date(timestamp).toLocaleString('default', { month: 'short' })
    var year = new Date(timestamp).getFullYear();
    var week = GraphicalCounters.getWeekOfMonth(new Date(timestamp));

    var type = `Monthly_File_${month}_${year}`;
    var xpoint = name;

    var params = {
        TableName: keys.Table,
        Key: {
            "type": type,
            "id": uid
        },
        UpdateExpression: " SET #counter = #counter + :incva",
        ExpressionAttributeNames:{
            "#counter": "count"
        },
        ExpressionAttributeValues:{
            ":incva": count
        },
        ReturnValues:"UPDATED_NEW"
    };
     docClient.update(params, async (err , data) =>{
         if(err){
             if(err.code === "ValidationException"){
                var params = {
                    TableName: keys.Table,
                    Item: {
                        type: type,
                        id: uid,
                        count:  count,
                        username: xpoint,
                    }
                   }
                   docClient.put(params, async (err, data) => {
                     if(err){
                      console.log(err)
    
                      }else{
                       console.log("Initialized new Monthly File counter")
                        resolve(true)                         
                       }
                    })
             }else{
                    console.log(err)
                  }
         }else{
              //Update weekly Counter
              console.log("Updated Monthly User filr counter")
              resolve(true)
         }
     })

})
}

GraphicalCounters.updateUserWeeklyFiles = async (uid , count , name) => {
    
    return new Promise((resolve , reject) => {
        var timestamp = new Date().getTime();
        var month = new Date(timestamp).getMonth()+ 1;
        var monthName = new Date(timestamp).toLocaleString('default', { month: 'short' })
        var year = new Date(timestamp).getFullYear();
        var week = GraphicalCounters.getWeekOfMonth(new Date(timestamp));

        var type = `Weekly_File_${week}_${month}_${year}`;
        var xpoint = name;

        var params = {
            TableName: keys.Table,
            Key: {
                "type": type,
                "id": uid
            },
            UpdateExpression: " SET #counter = #counter + :incva",
            ExpressionAttributeNames:{
                "#counter": "count"
            },
            ExpressionAttributeValues:{
                ":incva": count
            },
            ReturnValues:"UPDATED_NEW"
        };
         docClient.update(params, async (err , data) =>{
             if(err){
                 if(err.code === "ValidationException"){
                    var params = {
                        TableName: keys.Table,
                        Item: {
                            type: type,
                            id: uid,
                            count:  count,
                            username: xpoint,
                        }
                       }
                       docClient.put(params, async (err, data) => {
                         if(err){
                          console.log(err)
        
                          }else{
                           console.log("Initialized new Monthly File counter")
                            resolve(true)                         
                           }
                        })
                 }else{
                        console.log(err)
                      }
             }else{
                  //Update weekly Counter
                  console.log("Updated Monthly User counter")
                  resolve(true)
             }
         })

    })
}

GraphicalCounters.increaseitemcount = async (value , Ctype , BookType , id) => {
    return new Promise((resolve , reject) => {
        var params = {
            TableName: keys.Table,
            Key: {
                "type": BookType ,
                "id": id
            },
            UpdateExpression: " SET #counter = #counter + :incva",
            ExpressionAttributeNames:{
                "#counter": Ctype
            },
            ExpressionAttributeValues:{
                ":incva": value
            },
            ReturnValues:"UPDATED_NEW"
        };
         docClient.update(params, async (err , data) =>{
             if(err){
                 if(err.code === "ValidationException"){
                     var params = {
                        TableName: keys.Table,
                        Key: {
                            type: BookType,
                            id: id,
                        },
                        UpdateExpression : "SET #counter = :val",
                        ExpressionAttributeNames: {
                            "#counter": Ctype
                        },
                        ExpressionAttributeValues: {
                            ":val": value
                        },
                        ReturnValues:"UPDATED_NEW"
                       }
                       console.log(params)
                       docClient.update(params, async (err, data) => {
                         if(err){
                          console.log(err)
        
                          }else{
                           console.log("Initialized Counter for book")
                            resolve(true)                         
                           }
                        })
                 }else{
                        console.log(err)
                      }
             }else{
                  //Update weekly Counter
                  console.log("Updated Book Counters")
                  resolve(true)
             }
         })

    })
}


module.exports = GraphicalCounters;
