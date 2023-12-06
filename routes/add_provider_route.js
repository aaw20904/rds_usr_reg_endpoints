const express= require("express");
let b64ops = require("../base64json");
let router = express.Router();
let checker = require("./query_param_check");


router.get("/add/start", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
    res.render("./add_provider/add_provider_start.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(estate), nonce: res.locals.nonce  });
});

router.get("/add/step2", async (req, res)=>{
    if(! checker.isSearchParamsExist(req.query, ["estate_id"])){
        res.sendStatus(400);
        return;
    }
    let results = await router.dbLayer.getCountersByEstate(req.query.estate_id);
    res.render("./add_provider/add_provider_step2.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(results), nonce: res.locals.nonce   })
});

router.get("/add/step3", async (req, res)=>{
 //res.json(req.query);
     if(! checker.isSearchParamsExist(req.query, ["estate_id","counter_id"])){
        res.sendStatus(400);
        return;
    }
    let results = await router.dbLayer.getProviderByCounterAndEstate(req.query.estate_id, req.query.counter_id);
    res.render("./add_provider/add_provider_step3.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(results), nonce: res.locals.nonce   })
});

router.get("/add/step4", async (req, res)=>{
   
    res.render("./add_provider/add_provider_step4.ejs",{ time: new Date().toLocaleTimeString() })
});

router.post("/add/step5", async (req, res)=>{
     if(! checker.isSearchParamsExist(req.body, ["provider_id","counter_id"])){
        res.sendStatus(400);
        return;
    }
    //res.json(req.body);
    let info = await router.dbLayer.checkInfoBeforeAddProvider(req.body.counter_id, req.body.provider_id);
    res.render("./add_provider/add_provider_step5.ejs",{ time: new Date().toLocaleTimeString(), 
                        provider:info.provider, region:info.region, factory_num:info.factory_num,
                         counter_type:info.counter_type, arrayOfAppData71:b64ops.objTobase64(req.body), 
                         nonce: res.locals.nonce });
})

router.post("/add/finish", async (req, res)=>{
    res.json(req.body);
})

module.exports=router;