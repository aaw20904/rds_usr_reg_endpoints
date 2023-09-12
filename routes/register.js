var express = require('express');
var router = express.Router();
const http = require('http');
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const url = require("url");

router._mailtemplate = fs.readFileSync("./views/mailregister.ejs",{encoding:"utf-8"});

//DATA,  HOST, PATH, PORT 
router._makeAuthorizationServerQuery = async (user_data={phone:"",name:"",password:"",email:""},au_host="localhost", au_path="/",  au_port=80)=> {
    const jsonString = JSON.stringify(user_data);

        let options = {
            hostname: 'localhost',
            port: 8080,
            path: '/register/begin_registration',
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(jsonString) // Calculate the length of the JSON string in bytes
                }
        };

        options.path=au_path;
        options.port = au_port;
        options.hostname = au_host;

   return await new Promise((resolve, reject) => {
                        const onResponse = (res)=>{
                            let responseData = '';

                                res.on('data', (chunk) => {
                                    responseData += chunk;
                                });

                                res.on('end', () => {
                                    let obj = JSON.parse(responseData)
                                    resolve(obj);
                                });
                        }
                            const req = http.request(options, onResponse);
                            //
                            req.on('error', (e) => {
                                reject(e);
                            });

                            req.write(jsonString);
                            req.end();
                });


}



/****options of SMTP - i`s only options of your email service.This mail will be used for register of users  */
router._workMail ={ host:"smtp.gmail.com", user:'kozakizdona@gmail.com', password:"lcopwvgmqcwsqpxy", backURL:`http://localhost/reg/finish?`};

router._sendRegistrationMsgToMail = async (par="b64urlString", email_new_user="example@microsoft.com", n_user="")=>{
            // Create a transporter
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
                service: "gmail",
                host: router._workMail.host,
                port: 587,
                secure:true,
                auth: {
                user: router._workMail.user ,
                pass: router._workMail.password,
            },
    });

   
    //generate html content
    const htmlMessage = ejs.render(router._mailtemplate, {user:n_user,time:new Date().toLocaleTimeString(), link:`${router._workMail.backURL}data=${par}`});
      // Set up email data
      let mailOptions = {
        from: 'kozakizdona@gmail.com',
        to:'andrej_chud@meta.ua',
        subject: 'Registration',
        text: 'Marry had a little lamb',
        html:htmlMessage
    };

    //set actual email address:

    mailOptions.to = email_new_user;

        // Send the email
      
     return new Promise((resolve, reject) => {
                        transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                 reject(error)
                                } else {
                                 resolve({msg:'Email sent successfully:', info:info.response});
                                }
                        });
      });
}


router.get("/content", (req, res)=>{
    res.render("register.ejs");
});

router.post("/",async (req, res)=>{
    //request to the authorization server  (DATA HOST PATH PORT)
    let result =  await router._makeAuthorizationServerQuery(req.body, 'localhost', '/register/begin_registration', 8080);
    await router._sendRegistrationMsgToMail(result.data, req.body.email);
    res.render("check_mail_reg.ejs",{date:new Date().toString()})
    //res.json(JSON.stringify(req.body));
});

router.get("/finish", async (req, res)=>{
    //parse URL search params
    let myUrl = new url.URL (req.originalUrl,`http://${req.headers.host}`);
    let data = myUrl.searchParams.get('data'); 

    res.json({data:user_data});

});


module.exports = router;