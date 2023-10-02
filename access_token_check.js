const http = require("http");

async function checkAccessToken (req, res) {
    if(!req.cookies.token){
        res._userInfo = false;
        return;
    } else {
    let result =  await new Promise(function (resolve, reject)  {
                            const jsonString = JSON.stringify(user_data);

                            let options = {
                                hostname: 'localhost',
                                port: 8080,
                                path: '/validate/',
                                method: 'POST',
                                    headers: {
                                        "Authorization":`Bearer ${req.cookies.token}`,
                                    }
                            };

                       


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

                //checking status of authorization
               console.log( result.statusCode );
               res._userInfo = result;
               return;
    }


}

module.exports = {checkAccessToken};