//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us3.api.mailchimp.com/3.0/lists/2362c34adb`;
  const options = {
    method: "POST",
    auth: "handa26:3d2391ba48d3c30d611d551efcd0ebfe-us3",
  };

  const request = https.request(url, options, (response) => {
    // Get feedback when submitting form
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// Redirect to root if page went wrong
app.post("/failure", (req, res) => {
  res.redirect("/");
});

// Heroku define the port itself
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running at port 3000...");
});
