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
      if(! checker.isSearchParamsExist(req.query, ["provider_id","estate_id","counter_id"])){
        res.sendStatus(400);
        return;
    }
   /* checking - has a credentials for the provider has been written by a user in DB?
   when yes - redirect to next step, othervise a user has to enter the one in this step */
  // input params for checking:  req.query.provder_id,      res._userInfo.user_id
  let isCredExists = await router.dbLayer.hasProviderCredentialsBeenEntered(res._userInfo.user_id, req.query.provider_id); 
  if (!isCredExists) {
    res.redirect(`step5?provider_id=${req.query.provider_id}&estate_id=${req.query.estate_id}&counter_id=${req.query.counter_id}`);
  } else {
    res.render("./add_provider/add_provider_step4.ejs",{ time: new Date().toLocaleTimeString() })
  }

    
});

router.get("/add/step5", async (req, res)=>{
    if (! checker.isSearchParamsExist(req.query, ["provider_id","counter_id","estate_id"])) {
        res.sendStatus(400);
        return;
    }
   
    let info = await router.dbLayer.checkInfoBeforeAddProvider (req.query.counter_id, req.query.provider_id);
     //checking - are there an additional parameters - acc_num, usr_login, usr_password ?
     if (req.query["acc_num"]) {
        //when exists - fill into the view:
                res.render("./add_provider/add_provider_step5.ejs", { time: new Date().toLocaleTimeString(), 
                                provider:info.provider, region:info.region, factory_num:info.factory_num,
                                counter_type:info.counter_type, arrayOfAppData71:b64ops.objTobase64(req.query), 
                                nonce: res.locals.nonce,  provider_acc:req.query.acc_num ,login_of_provider:"1",
                             password_of_provider:"1", 
                            hide_prov_credentials:"d-flex flex-column" });
     } else {
                res.render("./add_provider/add_provider_step5.ejs", { time: new Date().toLocaleTimeString(), 
                            provider:info.provider, region:info.region, factory_num:info.factory_num,
                            counter_type:info.counter_type, arrayOfAppData71:b64ops.objTobase64(req.query), 
                            nonce: res.locals.nonce, provider_acc:"" ,login_of_provider:"",
                             password_of_provider:"", 
                            hide_prov_credentials:"d-none" });
     }

});

router.post("/add/finish", async (req, res)=>{
    if (! checker.isSearchParamsExist(req.body, ["provider_id","counter_id","account"])) {
        res.sendStatus(400);
        return;
    }
    let result = await router.dbLayer.linkProviderToCounter(req.body.counter_id, req.body.provider_id);
    if (result.result) {
       res.render("./registration/success.ejs",{msg:"provider has been attached successfully!",date:new Date().toLocaleTimeString()})
    } else if (result.err) {
       res.render('user_error.ejs',{time:new Date().toLocaleTimeString(),msg:result.err, title:"Already added"});
       return;
    }

    res.json(req.body);
});

module.exports=router;