const http = require("http");
 let queryOptionForAuthServer={
    hostname: 'localhost',
    port: 8080,
    path: '/validate',
    method: 'POST',
 }

//function for authorzation of a user
async function checkAccessTokenMiddleware (request, res, next) {
    if (!request.cookies.token) {
        //when token isn`t exists
        res._userInfo = false;
        //redirect to login page
        res.redirect(`http://${req.hostname}/login/content`);
        return;
        
    } else {

        let result =  await new Promise(function (resolve, reject)  {
            //set authorization header 
                queryOptionForAuthServer.headers={
                        "Authorization":`Bearer ${request.cookies.token}`,
                }
                            
                let onResponse = function (resp){
                            let responseData = '';
                            const statusCode = resp.statusCode;

                            resp.on('data', (chunk) => {
                                //collect data
                                responseData += chunk;
                            });

                            resp.on('end', () => {
                                let obj;
                                try {
                                    obj = JSON.parse(responseData)
                                } catch (e) {
                                    //when JSON isn`t exists
                                    obj = {};
                                }
                                
                                obj.statusCode = statusCode;
                                resolve(obj);
                            });
                }


                        
                //create a  HTTP request object to authorization server and assign function to process response:
                    const req = http.request(queryOptionForAuthServer, onResponse);
                    //
                    req.on('error', (e) => {
                        reject(e);
                        next();
                    });
                    //start request
                    req.end();

                            
        });

            //checking status of authorization
            
            res._userInfo = result;
            
            //redirect when authorization fail
            if (result.statusCode != 200) {
                res.redirect(`http://${req.hostname}/login/content`);
            }else{
                res.cookie("token",result.token)
            }
            
            next();
    }


}

module.exports = {checkAccessToken,checkAccessTokenMiddleware};