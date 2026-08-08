var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// In-memory storage for registered applications
const registeredApplications = {};

// req.mongodb.connect().then(function(){
//   var websiteModel = req.mongodb.useCollection("websites");
//   if(websiteModel){
//     var web = new websiteModel({
//       name:'hkmcode',
//       url:"https://hkmcode.com",
//       callbackUrl: "https://hkmcode.com/api/service/callback",
//     });

//     // Save the book document
//     web.save().then(()=>{
//       console.log('website saved successfully');
//       res.render('home', { title: 'HOME'});

//     }).catch((err)=>{
//       console.error(err);
//       res.render('home', { title: 'HOME'});

//     })
     
//   }

// }).catch((error) => {
//   console.error("Error:", error.message);
//   res.render('home', { title: 'HOME'});

// });

// /* GET home page. */
router.post('/register', function(req, res, next) {
  try {
    const { appName, appURL, developerName, appCallback, developerEmail } = req.body;
    // Check if all required fields are provided
    if (!appName || !appURL || !appCallback || !developerName || !developerEmail) {
      return res.status(400).json({ error: 'All fields (appName, appURL, appCallback, developerName, developerEmail) are required.' });
    }

    // Parse the URLs
    const appURLObject = new URL(appURL);
    const appCallbackObject = new URL(appCallback);

    // Check if the hostnames are the same
    if (appURLObject.hostname !== appCallbackObject.hostname) {
      return res.status(400).json({ error: 'The callback hostname must match the app URL hostname.' });
    }

    // Check if the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(developerEmail)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Generate a unique app token (you might want to use a more secure method)
    const appToken = uuid.v4();

    // Store the app information in memory or your database
    registeredApplications[appName] = {
      appToken,
      appURL,
      developerName,
    };
    
    res.json({
      appName,
      appToken,
      appURL,
      developerName,
    });
  } catch (error) {
   
    // Pass the error to the next middleware (API error handling middleware)
    next(error);
  }
  

});


module.exports = router;
