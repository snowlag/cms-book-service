var express = require("express"),
     app= express(),
     auth = require("./Routes/Auth/auth"),
     book = require("./Routes/BookCMS/bookcms.js"),
     bodyParser = require("body-parser"),
     passport = require("passport");
     uploadFiles = require("./Routes/uploads/uploadfiles.js");
     request = require("request");
 const path = require('path');
     //UnComment these for first run
     // setCounter = require("./controller/setCounter.js")


//Body Parser -------------------
app.use(bodyParser.urlencoded({extended : false}));
// router.use(methodOverride("_method"));
app.use(bodyParser.json()); 

//Passport Middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);
app.use(auth);
app.use(book);
app.use(uploadFiles);

// // Set static folder
// app.use(express.static('client/build'));

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Client', 'build', 'index.html'));
});
}


// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

const port = process.env.PORT || 5000;

app.listen(port ,process.env.IP, () => console.log(`Server running on port ${port}`));

// app.listen(process.env.PORT,process.env.IP,function(){
//   console.log("Server has started")
// }); 


