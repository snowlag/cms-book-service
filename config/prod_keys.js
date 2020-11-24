var env = {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY, 
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY, 
    Bucket: process.env.BUCKET,
    Table: process.env.TABLE,
    JwtSecret: process.env.JWTSECRET,
    CounterId: process.env.COUNTERID,
    SearchUrl: process.env.SEARCHURL
  };
   
module.exports = env;