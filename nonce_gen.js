const crypto = require("crypto");
const { resolve } = require("path");

async function insertNonceInResp(){
     return  await   new Promise((resolve, reject) => {
            crypto.randomBytes(8, (err, buf)=>{
                let str = buf.toString("hex");
                resolve(str);
            })
        });
    
    
}

module.exports={insertNonceInResp};