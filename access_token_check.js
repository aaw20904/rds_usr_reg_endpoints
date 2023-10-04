const http = require("http");

async function checkAccessToken (request, res) {
    if (!request.cookies.token) {
        res._userInfo = false;
        return;
    } else {
    let result =  await new Promise(function (resolve, reject)  {
                            
                            let options = {
                                hostname: 'localhost',
                                port: 8080,
                                path: '/validate',
                                method: 'POST',
                                    headers: {
                                        "Authorization":`Bearer ${request.cookies.token}`,
                                    }
                            };

                                 let onResponse = function (resp){
                            let responseData = '';
                            const statusCode = resp.statusCode;

                                resp.on('data', (chunk) => {
                                    responseData += chunk;
                                });

                                resp.on('end', () => {
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

                            
                            req.end();

                         
                });

                //checking status of authorization
               
               res._userInfo = result;
               return;
    }


}

module.exports = {checkAccessToken};