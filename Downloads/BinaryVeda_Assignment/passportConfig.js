// This file:-
// uses Passport.js Local Strategy
// logs-in the user
// puts all details of user in 'req'(request)
// checks if details inputted on log-in page match details in DataBase or not

const LocalStrategy = require('passport-local').Strategy;
const {User} = require('./database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.initializingPassport = (passport)=>{

    passport.use(new LocalStrategy({usernameField: 'email'}, async(email, password, done)=> {
        try {
            const user = await User.findOne({email});

            if (!user)
            {
                return done(null,false);
            }
            
            // Load hash from the db, which was preivously stored
             bcrypt.compare(password, user.password, function(err, res) {
                // if res == true, password matched
                if (res == true)
                    return done(null,user);
                // else wrong password
                else  
                    return done(null,null);
             });

        }
        catch (error)
        {
            return done(error,false);
        }

    }));

    passport.serializeUser((user,done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done)=> {
        
        try {
            const user = await User.findById(id);

            done(null, user);
        } catch (error) {
            done(error,false);
        }
    });

};

// This function checks if user is logged-in, else throws an error message
exports.isAuthenticated = (req,res,next)=> {

    if (req.user) return next();

    res.send("You cannot view this page")

};