const express = require("express");
let router =  express.Router();
const http =  require("http");

    router._makeAuthorizationServerQuery = async function (user_data={}, au_host="localhost", au_path="/",  au_port=80) {
    

   return await new Promise(function (resolve, reject)  {
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


                        let onResponse = function (res){
                            let responseData = '';
                            const statusCode = res.statusCode;

                                res.on('data', (chunk) => {
                                    responseData += chunk;
                                });

                                res.on('end', () => {
                                    let obj;
                                    try {
                                        obj = JSON.parse(responseData)
                                    } catch (e) {
                                        obj = {};
                                    }
                                    
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

 

router.get("/content",(req,res)=>{
    res.render("login.ejs",{errMsg:""});
})


router.post("/", async (req,res)=>{
    if (req.body.email && req.body.password) {
        let result;
        ///query to authorization server
        try {
             result = await router._makeAuthorizationServerQuery(req.body, au_host="localhost", au_path="/login",  au_port=8080);
        } catch(e) {
            result = {};
            result.statusCode=404;
        }
       
       switch(result.statusCode){
        case 400:
       res.render("wrond_data.ejs",{time:new Date().toLocaleTimeString(), msg:"You are locked.Please contact to the Admin"})
            break;
        case 401:
         res.render("login.ejs",{errMsg:"Incorrect login or password!"});
            break;
        case 403:
            res.render("wrond_data.ejs",{time:new Date().toLocaleTimeString(), msg:"You have too many fail login attempts! Try log In later"})
            break;
        case 404:
            res.render("wrong_data.ejs",{time:new Date().toLocaleTimeString(), msg:"Authorization server ureachable"})
            break;
        case 201:
            ///W H E N   L O G  I N   S U C C E E S S F U L L Y
            res.cookie('token',result.token);
            res.redirect("../");
            break;
            default:
                res.render("wrond_data.ejs",{time:new Date().toLocaleTimeString(), msg:"Error!"})

       }
    } else {
        res.status(400);
        res.render("wrong_data.ejs",{msg:"Bad request!"});
    }
    
})

module.exports=router;