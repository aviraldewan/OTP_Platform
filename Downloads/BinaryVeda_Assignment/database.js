// This file:-
// connects web-app to MongoDB Atlas
// defines the User Schema for database

// NOTE- Environment Variables are stored in .env file in Aviral's system and not uploaded to GitHub Repo

const mongoose = require('mongoose');
require('dotenv').config();

// Store MongoDB Atlas URL
const DB = process.env.MONGODB_ATLAS_URL;

// Function to connect to MongoDB Atlas and export this funciton
// If error in conncting, then print the same in console
exports.connectMongoose = ()=>{ 

        mongoose.connect(DB,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=> {
        console.log("Successfully Connected to DataBase");
    }).catch((err)=> console.log("Error in connecting to Data Base"));

}

// User Schema for Data Base
// User has following 'properties' :- 
//      name,age,username(email),phone,password
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    phone: String,
    password: String
});

// Export the user schema as User
exports.User = mongoose.model("Users",userSchema);