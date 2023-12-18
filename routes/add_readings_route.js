const express= require("express");
let b64ops = require("../base64json");
let router = express.Router();
let checker = require("./query_param_check");

router.get("/add/start", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
    res.render("./add_provider/add_provider_start.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(estate), nonce: res.locals.nonce  });
});


module.exports=router;