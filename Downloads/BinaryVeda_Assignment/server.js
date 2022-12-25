// This file:-
// signs-up the user
// logs-in the user
// logs-out the user
// runs the web-app server

const express = require('express');
const app = express();
const passport = require('passport');
const {connectMongoose, User} = require('./database');
const expressSession = require('express-session');
const validator = require('email-validator');
const {initializingPassport, isAuthenticated } = require('./passportConfig');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const server = app.listen(8080);
server.keepAliveTimeout = 61 * 1000;
require('dotenv').config();

const port = process.env.PORT;

// Connect to MongoDB Atlas
connectMongoose();

initializingPassport(passport);

// Middle Wares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressSession({secret: "secret", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


// Since, we are storing user's Phone Number as a string in MongoDB.
// So, it becomes essential to check if the given Phone Number contains 
// any alphabet in it or not. 
// This function returns true if the given string contains an alphabet, else false

function containsAnyLetters(str)
{
    return /[a-zA-Z]/.test(str);
}


// Register the User
app.post('/register', async (req,res)=>{

    const name = req.body.name;
    const age = req.body.age;
    const email =  req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    // check if each detail is entered or not
    if (name == null || age == null || phone == null || password == null || email == null)
    {
        return res.status(400).send("Please enter all details");
    }

    // Check if user has provided all the details
    if (name.length === 0 || age < 0 || phone.length !== 10 || password.length === 0)
    {
        return res.send("Please fill all the details correctly");
    }

    // check if Phone Number is valid
    // Also, check if email is correct or not
    if (validator.validate(email) === false || containsAnyLetters(phone))
    {
        return res.send("Please fill all the details correctly");
    } 

    // Check if a user already exists with this username
    var user = await User.findOne({email: email});
    
    // if it exists with same username then display error message to user
    if (user)
    {
        return res.status(400).send("User already exists.");
    }

    bcrypt.hash(password, saltRounds, async(err, hash) => {
        // Now we can store the password hash in db.

         // Create new user
        const newUser = await User.create({
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            password: hash
        });
      });

    // Display success message
    return res.send("Sign Up Successful!");
    
});

// Log-in the user
app.post('/login', passport.authenticate("local", {failureRedirect: "/error"}),
    function(req, res) {
        res.redirect('/profile');
});

// Only accessible to logged-in user.
// This page displays all the details of user
app.post("/profile",  isAuthenticated, async (req,res)=> {

    const user = await User.findOne({email: req.body.email});

    // Store all details of user as template literal(String)
    const details = `Name: ${user.name}, Age: ${user.age}, Email: ${user.email}, Phone: ${user.phone}`;

    return res.send(details);

});

// Error Page
app.post("/error", async(req,res)=> {

    const user = await User.findOne({email: req.body.email});

    if (!user)
        return res.send("User doesn't exist");
    
    if (user.password !== req.body.password)
        return res.send("Please enter correct Password");

});

// Log out the user
app.get('/logout',isAuthenticated, function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.send("Logged Out");
    });
  });


// Start the web-app
app.listen(port, ()=>{
    console.log(`Listening at port: ${port}`);
});