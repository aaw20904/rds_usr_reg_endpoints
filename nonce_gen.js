const crypto = require("crypto");
const { resolve } = require("path");

async function insertNonceInResp(req, res, next){
     let result = await   new Promise((resolve, reject) => {
            crypto.randomBytes(8, (x)=>{
                let str = x.toString("hex");
                resolve(str);
            })
        });
    
    req.locals.nonce = result;
    next();
}

module.exports={insertNonceInResp};