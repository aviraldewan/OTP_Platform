const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");

const port = process.env.PORT || 7000;
const config = require("./config");
// Firebase file importing
const User = require("./config2");

const client = require("twilio")(config.accountSID, config.authToken);

// Convert form-data to JSON
app.use(bodyParser.json());

// Encode form-data so we can use later
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/form-submit", (req, res) => {
    client
        .verify
        .services(config.serviceID)
        .verifications
        .create({
            to: `+${req.body.phone}`,
            channel: req.body.channel
        })
        .then((data) => {
            res.status(200).sendFile(__dirname + "/verify.html");
        });
});

app.post("/verify", async (req, res) => {
    client
        .verify
        .services(config.serviceID)
        .verificationChecks
        .create({
            to: `+${req.body.phone}`,
            code: req.body.code
        })
        .then((data) => {
            console.log(data);
            if (data.valid == false)
                res.status(200).sendFile(__dirname + "/failure.html");
            else
            {
                // Add User in database
                const number = data.to;
                User.add({ number });
                console.log("User added");
                res.status(200).sendFile(__dirname + "/success.html");
            }
        });
})

// display all existing users
app.get("/users", async (req, res) => {
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
});

app.listen(port, () => {
    console.log(`Listening at *${port}`);
})