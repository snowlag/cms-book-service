const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var AWS = require("aws-sdk");
var keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.JwtSecret;

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = passport => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
      
    //Find User by its Id
    var params ={
    TableName: keys.Table,
    KeyConditionExpression: '#id = :user_id and #type = :t',
    ExpressionAttributeNames:{
        "#id": "id",
        "#type": "type"
    },
    ExpressionAttributeValues: { 
        ':user_id' : jwt_payload.id,
        ':t' : jwt_payload.type            
  }      
    }
    docClient.query(params, (err , data)=> {
        if(data){
          //Check if Username exists or not
            if(data.Count == 0){
                return done(null, false);
            } else {
                return done(null, data.Items[0]);
            }
        }  else{
            console.log(err)
        }
         
        });


        // User.findById(jwt_payload.id)
        //   .then(user => {
        //     if (user) {
        //       return done(null, user);
        //     }
        //     return done(null, false);
        //   })
        //   .catch(err => console.log(err));
      })
    );
  };