const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const listId = "f724467473";
const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

      app.get('/', (req, res) => {
        res.sendFile(__dirname + "/signup.html")
        })

        app.post('/',(req, res) => {
            var fname =req.body.firstName;
            var lname =req.body.lastName;
            var mail = req.body.email;
           
            console.log(fname)
            console.log(lname)
            console.log(mail)

            mailchimp.setConfig({
              apiKey: "3112ccf8dd78ef24c23221e1dd8bc359-us21",
              server: "us21"
            });
            
            const subscribingUser = {
                firstName:fname,
                lastName: lname,
                email: mail
              };
            async function run() {

              const response = await mailchimp.lists.addListMember(listId,{
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                  FNAME: subscribingUser.firstName,
                  LNAME: subscribingUser.lastName,
                } 
              }).then(
                (value) => {
                  
                    console.log("Successfully added contact as an audience member.");
                    res.sendFile(__dirname + "/success.html");
                    console.log(value);
                    console.log("Successfully added as an audience member. The contact's id is "+value.id);
                },
                (reason) => {
                  res.sendFile(__dirname + "/failure.html");
                    console.log(reason);
                },
            );    
        };
      run();
    });

    app.post("/failure", function(req, res){
          res.redirect("/")
    })

    app.listen(port || process.env.PORT, function(){
        console.log("server started at port");
    })
