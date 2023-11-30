const express= require("express");
let b64ops = require("../base64json");
let router = express.Router();


router.get("/add/start", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
    res.render("./add_provider/add_provider_start.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(estate), nonce: res.locals.nonce  });
});

router.get("/add/step2", async (req, res)=>{
    let results = await router.dbLayer.getCountersByEstate(req.query.estate_id);
    res.render("./add_provider/add_provider_step2.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(results), nonce: res.locals.nonce   })
});

router.get("/add/step3", async (req, res)=>{
 //res.json(req.query);
    let results = await router.dbLayer.getProviderByCounterAndEstate(req.query.estate_id, req.query.counter_id);
    res.json(results);
   // res.render("./add_provider/add_provider_step2.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(results), nonce: res.locals.nonce   })
});


module.exports=router;