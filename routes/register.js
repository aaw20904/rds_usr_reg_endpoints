var express = require('express');
var router = express.Router();
const http = require('http');
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const url = require("url");
const queryChecker = require("./query_param_check");

router._mailtemplate = fs.readFileSync("./views/registration/mailregister.ejs",{encoding:"utf-8"});

router._extractDomainFromEmail=(email)=> {
    const match = email.match(/@(.+)/);
    return match ? match[1] : null;
}

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

   return await new Promise(function (resolve, reject)  {
                        let onResponse = function (res){
                            let responseData = '';
                            const statusCode = res.statusCode;

                                res.on('data', (chunk) => {
                                    responseData += chunk;
                                });

                                res.on('end', () => {
                                    let obj = JSON.parse(responseData)
                                    obj.statusCode = statusCode;
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



/****options of SMTP - it`s only options of your email service.This mail will be used for register of users  */
router._workMail ={ host:"smtp.gmail.com", user:'kozakizdona@gmail.com', password:"gqyj gtsm uhxf ealk", backURL:`http://localhost/reg/finish?`};

router._sendRegistrationMsgToMail = async (par="b64urlString", email_new_user="example@microsoft.com", n_user="Wasya")=>{
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
    const htmlMessage = ejs.render( router._mailtemplate, {user:n_user, time:new Date().toLocaleTimeString(), link:`${router._workMail.backURL}data=${par}`});
      // Set up email data
      let mailOptions = {
        from: 'kozakizdona@gmail.com',
        to:'andrej_chud@meta.ua',
        subject: 'Registration',
        text: 'Rgistraion a new user',
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
    res.render("./registration/register.ejs");
});

router.get("/test",(req,res)=>{
    res.render("./registration/success.ejs", {msg: "The registration completed successfully", date: new Date().toLocaleTimeString()});
})

router.post("/",async (req, res)=>{

     if (! queryChecker.isSearchParamsExist(req.body,  ["phone","name","password","email"])) {
        res.sendStatus(400);
        return;
    }
     
    try{

       
        //request to the authorization server  (DATA HOST PATH PORT)
        let result =  await router._makeAuthorizationServerQuery(req.body, 'localhost', '/register/begin_registration', 8080);
        if (result.statusCode == 200) {
                 await router._sendRegistrationMsgToMail(result.data, req.body.email, req.body.name);
                 let userMailDomain =  router._extractDomainFromEmail(req.body.email);
                 res.render("./registration/check_mail_reg.ejs",{userMailServer: `https://${userMailDomain}`,date:new Date().toLocaleTimeString()})
        } else if (result.statusCode == 409) {
                res.render("wrong_data",{msg: "User with this e-mail already exists", time:new Date().toLocaleTimeString(), back_url:"../reg/content"});
        } else {
             res.render("wrong_data",{msg: "Bad or corrupted data!", time:new Date().toLocaleTimeString(), back_url:"../reg/content"});
        }

    }catch(e){
        res.render('error.ejs',{err:e})
    }
  
    //res.json(JSON.stringify(req.body));
});

router.get("/finish", async (req, res)=>{

      if (! queryChecker.isSearchParamsExist(req.query,  ["data"])) {
        res.sendStatus(400);
        return;
    }
    let data = req.query.data;
    //parse URL search params
    //let myUrl = new url.URL (req.originalUrl,`http://${req.headers.host}`);
    //let data = myUrl.searchParams.get('data'); 
    //send data to the server
    try{
        //request to the authorization server  (DATA HOST PATH PORT)
        let result =  await router._makeAuthorizationServerQuery({data}, 'localhost', '/register/register_finish', 8080);
        if (result.statusCode == 201) {
            res.render("./registration/success.ejs", {date:new Date().toLocaleTimeString(), msg:"You are registered successfully"});
        } else {
            res.render("wrong_data",{time:new Date().toLocaleTimeString(), msg: "The registration data deprecated.Please re-send letter", back_url:"../reg/content"});
        }
        //res.json(result);
    }catch(e){
         res.render('server_error.ejs',{err:e.code, time:new Date().toLocaleTimeString()})
         return;
    }
    //res.json({data:user_data});

});


module.exports = router;