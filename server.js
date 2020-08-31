const express = require("express");
const app = express();

const session = require('express-session');
// const DynamoDBStore = require('connect-dynamodb')({session: session});
const PORT = process.env.PORT || 8080
const path = require('path')
const bodyParser = require('body-parser')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const fileUpload = require('express-fileupload')
const vision = require('@google-cloud/vision')
const cors = require('cors')
// const DynamoStore = require('connect-dynamodb-session')(session);
const passport = require('passport')
// const LocalStrategy   = require('passport-local').Strategy;
const bcrypt   = require('bcrypt-nodejs');
const routes = require('./server/api/users')
//maybe delete later
if (process.env.NODE_ENV === "dev") require("./secrets");
// endpoint: process.env.AWS_ENDPOINT,
// accessKeyId: process.env.ACCESS_KEY_ID,
// secretAccessKey: process.env.SECRET_ACCESS_KEY,
// This serves static files from the specified directory
app.use(express.static(__dirname + "/public"));

// app.use(redirectToHTTPS([/localhost:8080/], [], 301));

//parser for multipart/form-data
app.use(fileUpload())
app.use(cors())
app.use(redirectToHTTPS([/localhost:8080/], [], 301));
// This serves static files from the specified directory
app.use(express.static(__dirname + "/public"));

app.use(require('cookie-parser')());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const AWS = require("aws-sdk");
let awsConfig = {
  region: "us-east-2",
  endpoint: process.env.AWS_ENDPOINT,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);
//connecting to AWS DynamoDB
const DynamoDB = new AWS.DynamoDB();
let options = {
  tableName: 'mySessionTable',
  consistentRead: false,
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region
};
//  app.use(session({store: new DynamoDBStore(options), secret: 'capstone'}));


// app.use(session({
//   secret: 'capstone',
//   store: new DynamoStore(options)
// }));

//ORIGINAL
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'Capstone!',
//     resave: false,
//     saveUninitialized: false
//   })
// )


app.use(passport.initialize())
app.use(passport.session())


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.use('/api/users', routes)

app.post('/gvision', async (req, res, next) => {
  try {
    //still need these console.logs for mobile tests
    console.log('hi from the gvision route!')
    console.log(req.files.img)
    const client = new vision.ImageAnnotatorClient()
    const fileName = req.files.img.data
    //result is the full json object
    const [result] = await client.documentTextDetection(fileName)
    //result.fullTextAnnotation.text gives us one string with all transcribed text
    const fullTextAnnotation = result.fullTextAnnotation
    res.send(fullTextAnnotation.text.split('\n'))
  } catch(e) { next(e) }
})

// sends index.html
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'Capstone!',
//     resave: false,
//     saveUninitialized: false
//   })
// )

const server = app.listen(PORT, () => {
  console.log("App listening at port ", PORT);
});
